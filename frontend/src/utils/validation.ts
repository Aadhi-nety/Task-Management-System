export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): ValidationResult => {
  const errors: string[] = [];

  if (!username) {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  } else if (username.length > 30) {
    errors.push('Username must be less than 30 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProjectName = (name: string): ValidationResult => {
  const errors: string[] = [];

  if (!name) {
    errors.push('Project name is required');
  } else if (name.length > 100) {
    errors.push('Project name must be less than 100 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTaskTitle = (title: string): ValidationResult => {
  const errors: string[] = [];

  if (!title) {
    errors.push('Task title is required');
  } else if (title.length > 200) {
    errors.push('Task title must be less than 200 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateDeadline = (deadline: string): ValidationResult => {
  const errors: string[] = [];

  if (deadline) {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      errors.push('Deadline cannot be in the past');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};