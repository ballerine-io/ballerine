import * as countries from 'i18n-iso-countries';
import { NormalizedAddress } from '../types';

/**
 * Normalizes a raw address string or object into a structured format
 */
export const normalizeAddress = (
  address: string | any,
  countryCode?: string,
): NormalizedAddress => {
  const defaultAddress: NormalizedAddress = {
    country: 'N/A',
    state: 'N/A',
    city: 'N/A',
    street: 'N/A',
    number: 'N/A',
    postalCode: 'N/A',
  };

  // Handle case when address is already in structured format (European format)
  if (typeof address === 'object' && address !== null) {
    // Handle structured address like the European example
    if (address.fullAddress && typeof address.fullAddress === 'string') {
      // We still want to use the structured data but also parse the fullAddress
      // to get any missing pieces
      const parsedAddress = { ...defaultAddress };

      // Start with the structured fields
      if (address.city) parsedAddress.city = address.city;
      if (address.postcode) parsedAddress.postalCode = address.postcode;
      if (address.municipality) parsedAddress.state = address.municipality;

      // Handle street name and number (common in European addresses)
      if (address.streetName) {
        // European addresses often have number after the street name (e.g. "Regeringsgatan 19")
        const streetMatch = address.streetName.match(/^(.+)\s(\d+)$/);
        if (streetMatch) {
          parsedAddress.street = streetMatch[1];
          parsedAddress.number = streetMatch[2];
        } else {
          parsedAddress.street = address.streetName;
        }
      }

      // Set country from country code if available
      if (countryCode) {
        try {
          const [country] = countryCode.split('-');
          const countryName = countries.getName(country, 'en');
          if (countryName) {
            parsedAddress.country = countryName;
          }
        } catch (error) {
          console.error('Error getting country name:', error);
        }
      }

      return parsedAddress;
    }

    // If it's an object but doesn't have fullAddress, stringify it for further processing
    address = JSON.stringify(address);
  }

  if (!address || typeof address !== 'string') return defaultAddress;

  // Process string address
  if (countryCode) {
    try {
      const [country] = countryCode.split('-');
      const countryName = countries.getName(country, 'en');
      if (countryName) {
        defaultAddress.country = countryName;
      }
    } catch (error) {
      console.error('Error getting country name:', error);
    }
  }

  // Look for postal codes in various formats
  // US zip code
  const usZipMatch = address.match(/\b\d{5}(?:-\d{4})?\b/);
  if (usZipMatch) {
    defaultAddress.postalCode = usZipMatch[0];
  } else {
    // Canadian postal code
    const canadianMatch = address.match(/\b[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/i);
    if (canadianMatch) {
      defaultAddress.postalCode = canadianMatch[0];
    } else {
      // European style postal code (digits with optional spaces)
      const europeanMatch = address.match(/\b\d{3,6}[\s-]?\d{0,4}\b/);
      if (europeanMatch) {
        defaultAddress.postalCode = europeanMatch[0];
      }
    }
  }

  // US state code
  const stateMatch = address.match(/\b([A-Z]{2})\b/);
  if (stateMatch) {
    defaultAddress.state = stateMatch[1];
  }

  // Try to extract city
  // US style: City, STATE ZIP
  const cityStatePattern = /([A-Za-z\s.]+),\s*[A-Z]{2}\s*\d{5}/;
  const cityMatch = address.match(cityStatePattern);
  if (cityMatch) {
    defaultAddress.city = cityMatch[1].trim();
  } else {
    // European style: often the city is in ALL CAPS
    const europeanCityMatch = address.match(/\b([A-Z]{3,})\b/);
    if (europeanCityMatch) {
      defaultAddress.city = europeanCityMatch[0];
    }
  }

  const addressParts = address.split(',').map((part: string) => part.trim());

  if (addressParts.length >= 1) {
    const streetPart = addressParts[0];

    // Handle US style: number street
    const usStreetMatch = streetPart.match(/^(\d+)\s+(.+)$/);
    if (usStreetMatch) {
      defaultAddress.number = usStreetMatch[1];
      defaultAddress.street = usStreetMatch[2];
    }
    // Handle European style: street number
    else {
      const euStreetMatch = streetPart.match(/^(.+)\s(\d+)$/);
      if (euStreetMatch) {
        defaultAddress.street = euStreetMatch[1];
        defaultAddress.number = euStreetMatch[2];
      } else {
        defaultAddress.street = streetPart;
      }
    }

    // If we couldn't extract city earlier, try from second part if available
    if (defaultAddress.city === 'N/A' && addressParts.length > 1 && addressParts[1]) {
      const cityPart = addressParts[1].split(' ')[0];
      defaultAddress.city = cityPart;
    }
  }

  return defaultAddress;
};

/**
 * Enriches an address with data from Google Maps geocoding results
 */
export const enrichAddressWithGeocodeResults = (
  address: NormalizedAddress,
  geocodeResult: google.maps.GeocoderResult,
): NormalizedAddress => {
  const updatedAddress = { ...address };

  if (!geocodeResult.address_components) {
    return updatedAddress;
  }

  geocodeResult.address_components.forEach(component => {
    const types = component.types;

    if (types.includes('country')) {
      if (updatedAddress.country === 'N/A') {
        updatedAddress.country = component.long_name;
      }
    } else if (types.includes('administrative_area_level_1')) {
      updatedAddress.state = component.long_name;
    } else if (types.includes('locality')) {
      updatedAddress.city = component.long_name;
    } else if (types.includes('route')) {
      updatedAddress.street = component.long_name;
    } else if (types.includes('street_number')) {
      updatedAddress.number = component.long_name;
    } else if (types.includes('postal_code')) {
      updatedAddress.postalCode = component.long_name;
    }
  });

  return updatedAddress;
};
