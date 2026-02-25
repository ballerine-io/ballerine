import * as countries from 'i18n-iso-countries';
import { NormalizedAddress } from '../types';

const DEFAULT_ADDRESS_VALUE = 'N/A';

const createDefaultAddress = (): NormalizedAddress => ({
  country: DEFAULT_ADDRESS_VALUE,
  state: DEFAULT_ADDRESS_VALUE,
  city: DEFAULT_ADDRESS_VALUE,
  street: DEFAULT_ADDRESS_VALUE,
  number: DEFAULT_ADDRESS_VALUE,
  postalCode: DEFAULT_ADDRESS_VALUE,
});

/**
 * Normalizes an address from various formats into a consistent structure
 */
export const normalizeAddress = (
  address: string | Record<string, any>,
  countryCode?: string,
): NormalizedAddress => {
  const defaultAddress = createDefaultAddress();

  if (typeof address === 'object' && address !== null) {
    if (address.fullAddress && typeof address.fullAddress === 'string') {
      return parseObjectAddress(address, countryCode);
    }

    address = JSON.stringify(address);
  }

  if (!address || typeof address !== 'string') {
    return defaultAddress;
  }

  if (countryCode) {
    setCountryFromCode(defaultAddress, countryCode);
  }

  extractAddressComponents(address, defaultAddress);

  return defaultAddress;
};

function parseObjectAddress(address: Record<string, any>, countryCode?: string): NormalizedAddress {
  const parsedAddress = createDefaultAddress();

  if (address.city) {
    parsedAddress.city = address.city;
  }

  if (address.postcode) {
    parsedAddress.postalCode = address.postcode;
  }

  if (address.municipality) {
    parsedAddress.state = address.municipality;
  }

  if (address.streetName) {
    const streetMatch = address.streetName.match(/^(.+)\s(\d+)$/);

    if (streetMatch) {
      parsedAddress.street = streetMatch[1];
      parsedAddress.number = streetMatch[2];
    } else {
      parsedAddress.street = address.streetName;
    }
  }

  if (countryCode) {
    setCountryFromCode(parsedAddress, countryCode);
  }

  return parsedAddress;
}

function extractAddressComponents(addressString: string, target: NormalizedAddress): void {
  extractPostalCode(addressString, target);
  extractState(addressString, target);
  extractCity(addressString, target);
  extractStreetInfo(addressString, target);
}

export const enrichAddressWithGeocodeResults = (
  address: NormalizedAddress,
  geocodeResult: google.maps.GeocoderResult,
): NormalizedAddress => {
  const updatedAddress = { ...address };

  if (!geocodeResult.address_components) {
    return updatedAddress;
  }

  const componentMapping: Record<string, keyof NormalizedAddress> = {
    country: 'country',
    administrative_area_level_1: 'state',
    locality: 'city',
    route: 'street',
    street_number: 'number',
    postal_code: 'postalCode',
  };

  geocodeResult.address_components.forEach(component => {
    for (const [geoType, addressField] of Object.entries(componentMapping)) {
      if (component.types.includes(geoType)) {
        if (geoType === 'country' && updatedAddress.country !== DEFAULT_ADDRESS_VALUE) {
          continue;
        }

        updatedAddress[addressField] = component.long_name;
        break;
      }
    }
  });

  return updatedAddress;
};

function setCountryFromCode(address: NormalizedAddress, countryCode: string): void {
  try {
    const [country] = countryCode.split('-');

    if (!country) {
      return;
    }

    const countryName = countries.getName(country, 'en');

    if (countryName) {
      address.country = countryName;
    }
  } catch (error) {
    console.error('Error getting country name:', error);
  }
}

function extractPostalCode(addressString: string, target: NormalizedAddress): void {
  const postalCodePatterns = [
    /\b\d{5}(?:-\d{4})?\b/, // US ZIP code
    /\b[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/i, // Canadian postal code
    /\b\d{3,6}[\s-]?\d{0,4}\b/, // European postal code
  ];

  for (const pattern of postalCodePatterns) {
    const match = addressString.match(pattern);

    if (match) {
      target.postalCode = match[0];

      return;
    }
  }
}

function extractState(addressString: string, target: NormalizedAddress): void {
  const stateMatch = addressString.match(/\b([A-Z]{2})\b/);

  if (stateMatch && stateMatch[1]) {
    target.state = stateMatch[1];
  }
}

function extractCity(addressString: string, target: NormalizedAddress): void {
  // Try US-style "City, ST 12345" pattern
  const cityStatePattern = /([A-Za-z\s.]+),\s*[A-Z]{2}\s*\d{5}/;
  const cityMatch = addressString.match(cityStatePattern);

  if (cityMatch && cityMatch[1]) {
    target.city = cityMatch[1].trim();

    return;
  }

  // Try European style with all caps city
  const europeanCityMatch = addressString.match(/\b([A-Z]{3,})\b/);

  if (europeanCityMatch) {
    target.city = europeanCityMatch[0];
  }
}

function extractStreetInfo(addressString: string, target: NormalizedAddress): void {
  const addressParts = addressString.split(',').map((part: string) => part.trim());

  if (addressParts.length < 1 || !addressParts[0]) {
    return;
  }

  const streetPart = addressParts[0];

  // Try US-style "123 Street Name" pattern
  const usStreetMatch = streetPart.match(/^(\d+)\s+(.+)$/);

  if (usStreetMatch && usStreetMatch[1] && usStreetMatch[2]) {
    target.number = usStreetMatch[1];
    target.street = usStreetMatch[2];

    // Try European-style "Street Name 123" pattern
  } else {
    const euStreetMatch = streetPart.match(/^(.+)\s(\d+)$/);

    if (euStreetMatch && euStreetMatch[1] && euStreetMatch[2]) {
      target.street = euStreetMatch[1];
      target.number = euStreetMatch[2];
    } else if (streetPart) {
      target.street = streetPart;
    }
  }

  // Try to extract city if not already found
  if (target.city === DEFAULT_ADDRESS_VALUE && addressParts.length > 1 && addressParts[1]) {
    const cityPart = addressParts[1].split(' ')[0];

    if (cityPart) {
      target.city = cityPart;
    }
  }
}
