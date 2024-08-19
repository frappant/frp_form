# Form Components Library

## Overview

This library contains a set of JavaScript components designed to handle various form elements with advanced features like validation, custom select dropdowns, and file uploads. Each component extends a base `Input` class, providing a unified API for managing form elements in web applications. These components streamline the creation and management of complex forms.

## Components

### 1. `Form.js`
- **Description**: The `Form` class is the core component that initializes and manages all form inputs. It provides methods for form validation, input initialization, and handling form submission.
- **Features**:
   - Custom validation for different input types.
   - Support for multi-step forms with paging.
   - Option to enable custom select dropdowns.
   - Hooks for custom submit and error handling.

### 2. `Input.js`
- **Description**: The `Input` class is the base class for all form components. It handles basic input functionalities like validation, event listeners, and managing feedback messages.
- **Features**:
   - Methods for input validation, focus handling, and blur events.
   - Support for custom feedback messages and required field handling.

### 3. `Checkbox.js`
- **Description**: Extends the `Input` class to handle checkbox inputs, including custom logic for managing focus and change events.
- **Features**:
   - Visual feedback for focus state.
   - Custom validation logic based on checkbox state.

### 4. `Radio.js`
- **Description**: Inherits from `Checkbox` and manages radio button inputs, including additional functionality for handling radio button groups.
- **Features**:
   - Manages selection state across multiple radio buttons in a group.
   - Custom event listeners tailored for radio button behavior.

### 5. `Email.js`
- **Description**: Extends the `Input` class to manage email inputs, ensuring proper validation and handling of email addresses.
- **Features**:
   - Custom validation for email format.
   - Integration with the broader form validation system.

### 6. `Tel.js`
- **Description**: Similar to `Email.js`, but tailored for telephone number inputs.
- **Features**:
   - Custom validation for telephone number formats.
   - Ensures compliance with input requirements for phone numbers.

### 7. `Select.js`
- **Description**: Handles standard HTML select elements, extending the `Input` class to manage select-specific validation and feedback.
- **Features**:
   - Custom handling of select dropdowns.
   - Validates selection state and provides appropriate feedback.

### 8. `CustomSelect.js`
- **Description**: Extends the `Select` component to provide enhanced dropdown functionality using a custom select library (`TomSelect`).
- **Features**:
   - Advanced customization options for dropdowns.
   - Integration with `TomSelect` for rich select features like search and custom placeholders.

### 9. `FileUpload.js`
- **Description**: Manages file upload inputs, extending the `Input` class to handle file-specific validation like maximum file size and file count.
- **Features**:
   - Validates the number of files uploaded and their total size.
   - Provides feedback messages specific to file upload issues.

### 10. `Signature.js`
- **Description**: Provides a signature pad input where users can draw their signatures. Extends `Input` and integrates with the `SignaturePad` library.
- **Features**:
   - Allows users to draw signatures directly on a canvas element.
   - Handles the conversion of drawn signatures to data URLs for form submission.

## Installation

To use these components in your project, simply include the JavaScript files in your project. Ensure that all dependencies are installed and configured correctly.

## Usage

1. **Initialize the Form**:
   ```javascript
   const form = new Form('#myForm', {
       customSelect: true,
       validateOnLoad: true,
       onSubmit: function(event) {
           console.log('Form submitted successfully');
       },
       onSubmitError: function(event) {
           console.log('Form submission failed');
       }
   });

2. **Add Custom Inputs**: Ensure your HTML inputs have unique IDs, and the form will automatically initialize them based on their types.

## Form Options

When initializing the `Form` class, you can pass an options object to customize its behavior. Below are the options you can configure:

### General Options

- **onSubmit**: `Function`
   - Callback function that gets called when the form is successfully submitted.
   - Example:
     ```javascript
     onSubmit: function(event) {
         console.log('Form submitted successfully');
     }
     ```

- **onSubmitError**: `Function`
   - Callback function that gets called when the form submission fails due to validation errors.
   - Example:
     ```javascript
     onSubmitError: function(event) {
         console.log('Form submission failed');
     }
     ```

- **novalidate**: `Boolean` (default: `true`)
   - Disables the browser's default form validation when set to `true`.

- **customSelect**: `Boolean` (default: `true`)
   - Enables or disables the custom select dropdowns provided by the `CustomSelect.js` component.

- **customRequired**: `String` or `null`
   - A custom message to display when a required field is not filled out.

- **customFeedback**: `String` or `null`
   - A custom invalid feedback message for form elements.

- **validateOnLoad**: `Boolean` (default: `false`)
   - If set to `true`, the form will validate all inputs on page load.

- **enableSubmitButtonOnValid**: `Boolean` (default: `false`)
   - When enabled, the submit button will be enabled only when all fields are valid.

### Custom Input Types

You can replace the standard form elements with custom implementations by extending the base `Input` class or other specific classes (like `Checkbox`, `Select`, etc.). To use your custom elements, override the `type` object within the options:

- **type.Signature**: `Signature` (default: `Signature.js`)
- **type.Checkbox**: `Checkbox` (default: `Checkbox.js`)
- **type.Radio**: `Radio` (default: `Radio.js`)
- **type.Email**: `Email` (default: `Email.js`)
- **type.Tel**: `Tel` (default: `Tel.js`)
- **type.Select**: `Select` (default: `CustomSelect.js` if `customSelect` is `true`, otherwise `Select.js`)
- **type.Input**: `Input` (default: `Input.js`)
- **type.FileUpload**: `FileUpload` (default: `FileUpload.js`)

#### Example: Replacing the `Checkbox` Component

If you have a custom checkbox implementation, you can replace the default one as follows:

```javascript
class MyCustomCheckbox extends Checkbox {
    // Custom implementation here
      constructor(checkbox, form, options = {}) {
          super(checkbox, form, options);
      }
}

const form = new Form('#myForm', {
    type: {
        Checkbox: MyCustomCheckbox
    }
});
```


## Standard Elements in Detail

### 1. `Checkbox.js`
- **Description**: Handles checkbox inputs with additional functionality like focus management and validation.
- **Features**:
   - Adds visual feedback for the focused state of checkboxes.
   - Custom validation logic to ensure correct checkbox state.

### 2. `Radio.js`
- **Description**: Extends `Checkbox` to manage radio buttons, including validation and focus across groups of radio buttons.
- **Features**:
   - Manages selection state across multiple radio buttons in a group.
   - Ensures only one radio button can be selected within a group.
   - Custom event listeners tailored for radio button behavior.

### 3. `Email.js`
- **Description**: Manages email inputs, ensuring proper format validation.
- **Features**:
   - Validates email format to ensure proper input.
   - Provides integration with the broader form validation system.

### 4. `Tel.js`
- **Description**: Handles telephone number inputs with custom validation rules.
- **Features**:
   - Custom validation for various telephone number formats.
   - Ensures compliance with input requirements for phone numbers.

### 5. `Select.js`
- **Description**: Manages standard select dropdowns, providing custom validation and feedback handling.
- **Features**:
   - Custom handling of select dropdowns to enhance user experience.
   - Validates selection state and provides appropriate feedback messages.

### 6. `CustomSelect.js`
- **Description**: An advanced version of `Select.js`, providing enhanced dropdown functionality using the `TomSelect` library.
- **Features**:
   - Provides advanced customization options for dropdowns.
   - Integrates with `TomSelect` for features like search and custom placeholders.

### 7. `FileUpload.js`
- **Description**: Handles file upload inputs, with validation for file size and number of files.
- **Features**:
   - Validates the number of files uploaded and their total size.
   - Provides feedback messages specific to file upload issues.

### 8. `Signature.js`
- **Description**: Provides a canvas-based signature input using the `SignaturePad` library.
- **Features**:
   - Allows users to draw signatures directly on a canvas element.
   - Handles the conversion of drawn signatures to data URLs for form submission.

## Event Listeners

You can attach event listeners to various form and input events to customize behavior. Below are some of the events you can listen to:

### Form Events

- **form:initialized**: Triggered when the form is fully initialized.
- **fields:focus**: Triggered when any input field gains focus.
- **field:validated**: Triggered when an input field has been validated.
- **field:error**: Triggered when an input field fails validation.
- **field:success**: Triggered when an input field passes validation.
- **form:submit**: Triggered when the form is submitted.

### Example: Attaching an Event Listener

To attach an event listener, you can use standard JavaScript event handling. For example:

```javascript
document.querySelector('#myForm').addEventListener('form:initialized', function(event) {
    console.log('Form has been initialized');
});
```

```javascript
document.querySelector('#myField').addEventListener('field:validated', function(event) {
    console.log('Field has been validated');
});
```