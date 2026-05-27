export function setFlash(ctx, type, message) {
  const session = ctx.state.session;
  if (session) {
    session.flash = { type, message };
  }
}

export function setSuccessFlash(ctx, message) {
  setFlash(ctx, 'success', message);
}

export function setErrorFlash(ctx, message) {
  setFlash(ctx, 'error', message);
}

export function setInfoFlash(ctx, message) {
  setFlash(ctx, 'info', message);
}

export function setWarningFlash(ctx, message) {
  setFlash(ctx, 'warning', message);
}

export function getFlash(ctx) {
  const session = ctx.state.session;
  if (session && session.flash) {
    const flash = session.flash;
    delete session.flash;
    return flash;
  }
  return null;
}

export const FlashMessages = {
  INTEREST_REGISTERED: 'Your interest has been successfully registered!',
  INTEREST_WITHDRAWN: 'Your interest has been withdrawn.',
  LOGIN_SUCCESS: 'Welcome! You have successfully logged in.',
  LOGOUT_SUCCESS: 'You have been successfully logged out.',
  PROGRAMME_CREATED: 'Programme created successfully!',
  PROGRAMME_UPDATED: 'Programme updated successfully!',
  PROGRAMME_DELETED: 'Programme deleted successfully!',
  MODULE_CREATED: 'Module created successfully!',
  MODULE_UPDATED: 'Module updated successfully!',
  MODULE_DELETED: 'Module deleted successfully!',
  INTEREST_ALREADY_REGISTERED: 'You have already registered interest in this programme.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  UNAUTHORIZED: 'You must be logged in to access this page.',
  PROGRAMME_NOT_FOUND: 'Programme not found.',
  MODULE_NOT_FOUND: 'Module not found.',
  INVALID_EMAIL: 'Please provide a valid email address.',
  REQUIRED_FIELDS: 'Please fill in all required fields.',
  NO_INTERESTS_YET: 'You haven\'t registered interest in any programmes yet.',
};
