export function validateCheckout(values, mode) {
  const errors = {};
  const name = values.name.trim();
  const phoneDigits = values.phone.replace(/\D/g, '');
  const address = values.address.trim();

  if (!name) errors.name = 'Enter your full name.';
  else if (name.length < 2 || !/^[\p{L}][\p{L}\s'.-]*$/u.test(name))
    errors.name = 'Use letters only, for example "Amina Uwase".';

  if (!values.phone.trim()) errors.phone = 'Enter a phone number we can reach you on.';
  else if (!/^[+\d\s().-]+$/.test(values.phone) || phoneDigits.length < 7 || phoneDigits.length > 15)
    errors.phone = 'Enter a valid phone number with 7 to 15 digits.';

  if (mode === 'delivery') {
    if (!address) errors.address = 'Enter your delivery address.';
    else if (address.length < 8)
      errors.address = 'Add more detail: street, number and area.';
  }

  if (values.notes.length > 200) errors.notes = 'Keep notes under 200 characters.';

  return errors;
}
