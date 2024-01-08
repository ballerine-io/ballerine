# React + TypeScript + Vite

This package provides tools and templates for PDF generation using React in both Front-End & BackEnd environments.

## Available templates

`ReportTemplate`

## DevMode

`npm run dev` - To start application with preview of base `ReportTemplate`

## Build

`npm run build` - Builds the bundle.

### Note

Before calling one of @react-pdf/renderer methods such as `renderToStream`, `renderToFile` fonts must be registered.

```
import {Font, renderToFile} from '@react-pdf/renderer'
import {registerFonts} from '@ballerine/react-pdf-toolkit'

registerFont(Font)

renderToFile()
```
