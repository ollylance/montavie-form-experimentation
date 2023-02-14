# Customizable Form Experimentation

## About

This web application was an experimentation on Angular development and working with Angular reactive forms to create dynamic, secure, and efficient posts. I wanted to create a form of a rich-text editor that had drag-and-drop rich text capabilities for modular multiform content. In this project, modules are broken up into subcomponents of the form as ControlValueAccessors. Each implement the neccessary functions to conform and allow the form to handle valid and invalid forms based on the modules own implementations. CDK Drag and Drop was added in, which was the original new idea for the form. It would allows users to fully have control over their work. On top of this, the project started experimenting with having CDK Portals that held the specified settings for each module. This would act as the rich text editing portion of each module and allows the subcomponents to express their own settings depending on the needs.


