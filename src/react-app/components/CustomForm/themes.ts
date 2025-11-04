

export interface FormTheme {
  // Form container styles
  form: {
    container: string;
    titleSection: string;
    title: string;
    description: string;
    fieldsContainer: string;
    buttonSection: string;
  };

  // Submit and reset button styles
  buttons: {
    submit: {
      base: string;
      disabled: string;
    };
    reset: {
      base: string;
      disabled: string;
    };
  };

  // Common field styles
  field: {
    container: string;
    label: string;
    requiredIndicator: string;
    description: string;
    errorMessage: string;
  };

  // Text/Email/Number input styles
  input: {
    base: string;
    normal: string;
    error: string;
    disabled: string;
    placeholder?: string;
  };

  // Textarea styles
  textarea: {
    base: string;
    normal: string;
    error: string;
    disabled: string;
  };

  // Select dropdown styles
  select: {
    base: string;
    normal: string;
    error: string;
    disabled: string;
  };

  // Boolean checkbox styles
  booleanCheckbox: {
    container: string;
    input: string;
    label: string;
    description: string;
  };

  // Checkbox group styles (for multi-select)
  checkboxGroup: {
    container: string;
    optionContainer: string;
    optionLabel: string;
    checkbox: string;
  };

  // Date field styles
  dateInput: {
    base: string;
    normal: string;
    error: string;
    disabled: string;
  };

  // Unsupported field type warning
  unsupportedField: {
    container: string;
    message: string;
  };
}

export const defaultFormTheme: FormTheme = {
  form: {
    container: "space-y-8",
    titleSection: "mb-8",
    title: "text-4xl md:text-6xl font-bold text-white uppercase tracking-tight font-['Anton']",
    description: "mt-4 text-lg text-white/80 font-['Inter']",
    fieldsContainer: "space-y-6",
    buttonSection: "flex justify-center pt-8",
  },

  buttons: {
    submit: {
      base: "w-full md:w-auto px-12 py-4 bg-white text-black text-lg font-bold font-['Inter'] uppercase tracking-wide hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    },
    reset: {
      base: "w-full md:w-auto px-8 py-3 border-2 border-white text-white text-sm font-semibold font-['Inter'] uppercase tracking-wide hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-200 disabled:opacity-50",
      disabled: "disabled:opacity-50",
    },
  },

  field: {
    container: "mb-6",
    label: "block text-sm font-semibold text-white mb-2 uppercase tracking-wide font-['Inter']",
    requiredIndicator: "text-red-400 ml-1",
    description: "text-sm text-white/70 mb-2 font-['Inter']",
    errorMessage: "mt-2 text-sm text-red-400 font-medium",
  },

  input: {
    base: "w-full px-4 py-4 border-2 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 text-lg font-['Inter']",
    normal: "border-white/30 hover:border-white/50",
    error: "border-white",
    disabled: "bg-white/10 cursor-not-allowed opacity-50",
  },

  textarea: {
    base: "w-full px-4 py-4 border-2 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 resize-vertical text-lg font-['Inter']",
    normal: "border-white/30 hover:border-white/50",
    error: "border-white",
    disabled: "bg-white/10 cursor-not-allowed resize-none opacity-50",
  },

  select: {
    base: "block w-full px-4 py-4 border-2 bg-transparent text-white focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 text-lg font-['Inter']",
    normal: "border-white/30 hover:border-white/50",
    error: "border-white",
    disabled: "bg-white/10 cursor-not-allowed opacity-50",
  },

  booleanCheckbox: {
    container: "flex items-center space-x-3",
    input: "h-5 w-5 border-2 border-white/50 bg-transparent focus:ring-4 focus:ring-white/30",
    label: "text-white font-medium font-['Inter']",
    description: "text-white/70 mt-2 ml-8 font-['Inter']",
  },

  checkboxGroup: {
    container: "space-y-3",
    optionContainer: "flex items-center space-x-3",
    optionLabel: "text-white font-medium font-['Inter']",
    checkbox: "h-5 w-5 border-2 border-white/50 bg-transparent focus:ring-4 focus:ring-white/30",
  },

  dateInput: {
    base: "w-full px-4 py-4 border-2 bg-transparent text-white focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 text-lg font-['Inter']",
    normal: "border-white/30 hover:border-white/50",
    error: "border-white",
    disabled: "bg-white/10 cursor-not-allowed opacity-50",
  },

  unsupportedField: {
    container: "mb-6 p-4 bg-white/10 border-2 border-white/20",
    message: "text-white font-['Inter']",
  },
};

/**
 * Deep merges a partial theme with the default theme
 * @param partialTheme - Partial theme to merge with defaults
 * @returns Complete theme with overrides applied, preserving all default properties
 */
export function mergeTheme(partialTheme?: Partial<FormTheme>): FormTheme {
  if (!partialTheme) {
    return defaultFormTheme;
  }

  // Deep merge helper for nested objects
  const mergeNestedObject = <T extends Record<string, any>>(
    defaultObj: T,
    partialObj?: Partial<T>
  ): T => {
    if (!partialObj) return defaultObj;
    return { ...defaultObj, ...partialObj };
  };

  return {
    form: mergeNestedObject(defaultFormTheme.form, partialTheme.form),
    buttons: {
      submit: mergeNestedObject(
        defaultFormTheme.buttons.submit,
        partialTheme.buttons?.submit
      ),
      reset: mergeNestedObject(
        defaultFormTheme.buttons.reset,
        partialTheme.buttons?.reset
      ),
    },
    field: mergeNestedObject(defaultFormTheme.field, partialTheme.field),
    input: mergeNestedObject(defaultFormTheme.input, partialTheme.input),
    textarea: mergeNestedObject(
      defaultFormTheme.textarea,
      partialTheme.textarea
    ),
    select: mergeNestedObject(defaultFormTheme.select, partialTheme.select),
    booleanCheckbox: mergeNestedObject(
      defaultFormTheme.booleanCheckbox,
      partialTheme.booleanCheckbox
    ),
    checkboxGroup: mergeNestedObject(
      defaultFormTheme.checkboxGroup,
      partialTheme.checkboxGroup
    ),
    dateInput: mergeNestedObject(
      defaultFormTheme.dateInput,
      partialTheme.dateInput
    ),
    unsupportedField: mergeNestedObject(
      defaultFormTheme.unsupportedField,
      partialTheme.unsupportedField
    ),
  };
}


