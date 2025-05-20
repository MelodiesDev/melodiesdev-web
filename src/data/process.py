import csv
import json
import math

def calculate_star_color(ci):
    """
    Calculate the hex color of a star based on its B-V color index
    using mathematical conversion via temperature.
    """
    # Handle missing or invalid values
    try:
        ci = float(ci)
    except (ValueError, TypeError):
        return "#FFFFFF", [255, 255, 255], 9000  # Default to white with approximate temperature
    
    # Convert B-V to temperature in Kelvin
    # Formula based on empirical data: log(T) = 3.988 - 0.881 * (B-V)
    if ci > -0.4 and ci < 2.0:  # Valid range for the formula
        temp = 10**(3.988 - 0.881 * ci)
    else:
        # Fallback for extreme values
        temp = 4600  # Default temperature
    
    # Convert temperature to RGB
    # Using Planck's blackbody radiation approximation for visible spectrum
    rgb = temp_to_rgb(temp)
    
    # Convert RGB to hex
    hex_color = "#{:02x}{:02x}{:02x}".format(*rgb)
    return hex_color, rgb, temp

def temp_to_rgb(temperature):
    """
    Convert temperature in Kelvin to RGB values using Planck's law approximation.
    Based on: http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
    """
    # Temperature should be between 1000 and 40000K
    temperature = max(1000, min(40000, temperature))
    
    # Calculate red
    if temperature <= 6600:
        red = 255
    else:
        red = temperature - 6000
        red = 329.698727446 * (red ** -0.1332047592)
        red = max(0, min(255, red))
    
    # Calculate green
    if temperature <= 6600:
        green = temperature
        green = 99.4708025861 * math.log(green) - 161.1195681661
    else:
        green = temperature - 6000
        green = 288.1221695283 * (green ** -0.0755148492)
    green = max(0, min(255, green))
    
    # Calculate blue
    if temperature >= 6600:
        blue = 255
    elif temperature <= 2000:
        blue = 0
    else:
        blue = temperature - 2000
        blue = 138.5177312231 * math.log(blue) - 305.0447927307
        blue = max(0, min(255, blue))
    
    return [int(red), int(green), int(blue)]

def adjust_for_atmosphere(rgb, magnitude):
    """
    Adjust star color for Earth's atmospheric effects.
    The atmosphere scatters blue light more than red light (Rayleigh scattering),
    and the effect increases with lower magnitudes (brighter stars appear more affected
    by atmospheric scintillation).
    """
    # Copy the original RGB values
    r, g, b = rgb.copy()
    
    # Atmospheric scattering coefficients (Rayleigh scattering affects blue most, red least)
    # These coefficients are approximations for typical atmospheric conditions
    red_coeff = 0.93    # Red is least affected
    green_coeff = 0.87  # Green is moderately affected
    blue_coeff = 0.78   # Blue is most affected
    
    # Scintillation factor - brighter stars (lower magnitude) have more pronounced effect
    # Scale is inversed: mag 1 = bright, mag 6 = dim
    scintillation_factor = 1.0 - (magnitude / 10.0)  # Ranges from ~0.4 to ~0.9 for mag 1-6
    
    # Apply atmospheric adjustments
    r = min(255, int(r * (1.0 - (1.0 - red_coeff) * scintillation_factor)))
    g = min(255, int(g * (1.0 - (1.0 - green_coeff) * scintillation_factor)))
    b = min(255, int(b * (1.0 - (1.0 - blue_coeff) * scintillation_factor)))
    
    # Stars also appear slightly more yellow/orange due to extinction
    # Add a slight yellow/orange tint
    r = min(255, r + int(5 * scintillation_factor))
    g = min(255, g + int(3 * scintillation_factor))
    
    # Convert back to hex
    atmospheric_color = "#{:02x}{:02x}{:02x}".format(r, g, b)
    return atmospheric_color

def estimate_star_size(spect, temperature, luminosity):
    """
    Estimate the relative size (radius) of a star compared to the Sun.
    Uses the relationship: Radius ∝ sqrt(Luminosity) / Temperature^2
    
    Parameters:
    - spect: Spectral classification
    - temperature: Star temperature in Kelvin
    - luminosity: Luminosity relative to Sun (optional)
    
    Returns the estimated radius relative to the Sun (solar radii)
    """
    # Default values
    DEFAULT_RADIUS = 1.0  # Solar radius
    
    # Try to use luminosity if it's available and valid
    try:
        lum = float(luminosity)
        if lum > 0:
            # Stefan-Boltzmann law: L ∝ R^2 * T^4
            # Therefore R ∝ sqrt(L) / T^2
            radius = math.sqrt(lum) * (5778 / temperature)**2
            return round(radius, 2)
    except (ValueError, TypeError):
        pass
    
    # If luminosity is not available or valid, estimate from spectral type
    if not spect or len(spect) < 1:
        return DEFAULT_RADIUS
    
    # Extract the main spectral class (O, B, A, F, G, K, M)
    main_class = spect[0].upper()
    
    # Approximate radius ranges by spectral class
    # These are rough estimates based on typical values
    radius_map = {
        'O': 10.0,    # O-type stars are typically 10-50 solar radii
        'B': 5.0,     # B-type stars are typically 3-10 solar radii
        'A': 2.0,     # A-type stars are typically 1.5-2.5 solar radii
        'F': 1.3,     # F-type stars are typically 1.1-1.5 solar radii
        'G': 1.0,     # G-type stars (like the Sun) are around 1 solar radius
        'K': 0.8,     # K-type stars are typically 0.7-0.9 solar radii
        'M': 0.5      # M-type stars are typically 0.1-0.7 solar radii
    }
    
    # Get the approximate radius from the map, or default to 1.0
    return radius_map.get(main_class, DEFAULT_RADIUS)

def process_stars(input_file, output_file):
    # List to store filtered stars
    filtered_stars = []
    
    # Read the CSV file with explicit encoding
    with open(input_file, 'r', encoding='utf-8', errors='replace') as csvfile:
        reader = csv.DictReader(csvfile)
        
        # Process each row
        for row in reader:
            # Convert magnitude to float (handling empty values)
            try:
                magnitude = float(row['mag'])
            except (ValueError, TypeError):
                continue
                
            # Filter stars with magnitude < 7
            if magnitude < 7:
                # Calculate color from B-V color index
                color_hex, rgb, temp = calculate_star_color(row.get('ci', ''))
                
                # Calculate how the star appears through Earth's atmosphere
                atmospheric_color = adjust_for_atmosphere(rgb, magnitude)
                
                # Estimate star size (in solar radii)
                star_size = estimate_star_size(row.get('spect', ''), temp, row.get('lum', ''))
                
                # Extract only the required fields
                star_data = {
                    'id': row['proper'],
                    'mag': magnitude,
                    'x': float(row['x']),
                    'y': float(row['y']),
                    'z': float(row['z']),
                    'color': color_hex,                   # True color in space
                    'atmospheric_color': atmospheric_color, # Color as seen from Earth
                    'temperature': int(temp),            # Star temperature in Kelvin
                    'spect': row.get('spect', ''),
                    'ci': row.get('ci', ''),
                    # Additional fields
                    'hip': int(row['hip']) if row.get('hip') and row['hip'].isdigit() else None, # Hipparcos ID
                    'size': star_size,                    # Estimated size in solar radii
                    'dist': float(row.get('dist', 0)),    # Distance in parsecs
                    'ra': float(row.get('ra', 0)),        # Right ascension
                    'dec': float(row.get('dec', 0)),      # Declination
                    'lum': float(row.get('lum', 0)) if row.get('lum') else None,  # Luminosity (Sun = 1.0)
                    'absmag': float(row.get('absmag', 0)) if row.get('absmag') else None,  # Absolute magnitude
                    'con': row.get('con', ''),            # Constellation
                    'vx': float(row.get('vx', 0)) if row.get('vx') else None,  # X velocity
                    'vy': float(row.get('vy', 0)) if row.get('vy') else None,  # Y velocity
                    'vz': float(row.get('vz', 0)) if row.get('vz') else None,  # Z velocity
                    'bayer': row.get('bayer', ''),        # Bayer designation
                    'flam': row.get('flam', ''),          # Flamsteed designation
                    'variable': row.get('var', '') != ''  # Is it a variable star?
                }
                
                # Add variable star information if available
                if row.get('var', '') and row.get('var_min') and row.get('var_max'):
                    try:
                        star_data['var_min'] = float(row['var_min'])
                        star_data['var_max'] = float(row['var_max'])
                    except (ValueError, TypeError):
                        pass
                
                filtered_stars.append(star_data)
    
    # Write the filtered data to a JSON file
    with open(output_file, 'w') as jsonfile:
        json.dump(filtered_stars, jsonfile, indent=2)
    
    return len(filtered_stars)

if __name__ == "__main__":
    input_file = "hygdata_v41.csv"
    output_file = "bright_stars.json"
    
    count = process_stars(input_file, output_file)
    print(f"Processed {count} stars with magnitude < 7")
