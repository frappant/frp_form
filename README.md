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


### Input.js

`Input.js` is the base class for all form components, providing key functionalities such as validation, event handling, and feedback management. It simplifies the creation of form inputs by centralizing common logic.

#### Key Methods and Features:

- **constructor(input, form, options = {})**: Initializes the input, setting up the element reference, form reference, and merging options. It also triggers the setup of event listeners and feedback management.

- **validate()**: Validates the input using the browser’s `checkValidity()` method. It manages the display of validation feedback by adding or removing `is-invalid` and `is-valid` classes based on the result.

- **focus(event)**: Handles focus events, adding a `focused` class to the input and its label if the field is active or filled.

- **blur(event)**: Triggers on blur events, updating the feedback message and validating the input.

- **setEventListeners()**: Sets up the essential event listeners for focus, blur, and change events. This method ensures the input reacts appropriately to user interactions.

- **setFeedbackElement()**: Finds or creates the element that will display validation messages. If a feedback element doesn’t exist, it creates one and appends it to the input’s parent node.

- **findClosest(sourceElement, targetSelector, levels = 5)**: Recursively searches for the closest matching element to the source element, within a specified number of levels up the DOM tree.

- **setError(message)**: Directly sets a custom error message in the feedback element.

- **setup()**: A placeholder method intended to be overridden in subclasses to handle any additional setup required for custom input types.

#### Example: Extending Input.js
To create a custom input with additional validation, extend the `Input` class and override necessary methods:

```javascript
import Input from 'frp_form/Fields/Input';

class CustomInput extends Input {
    validate() {
        super.validate(); // Retain base validation
        if (!this.$el.value.match(/your-regex/)) {
            this.setError('Custom validation message');
        }
    }
}
```
This example shows how to leverage the base class while adding custom validation logic.




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