## react-pdf-toolkit

`react-pdf-toolkit` is a package for generating PDF documents in React applications. Built on top of `@react-pdf/renderer`, it uses Tailwind CSS for styling, providing a set of components that simplify PDF creation.

### Features

- **Core Integration**: Utilizes `@react-pdf/renderer` for robust PDF rendering capabilities.
- **Tailwind CSS Styling**: Applies Tailwind CSS for styling, ensuring a seamless and efficient design workflow.
- **Component-Based**: Offers a collection of reusable components for quick and efficient PDF creation.

### Components

- `Badge`

- `Divider`

- `Image`

- `Link`

- `Typography`

- `List`

### Utils

`tw` - wrapper which converts tailwind classes to pdf styles.

Example:

```
tw('flex flex-row gap-4')
```

`mergeStyles` - merges set of style objects in to single one.

```
mergeStyles([tw('flex'), tw('flex-row')]) // {display: 'flex', flexDirection: 'row'}
```

`sanitizeString` - Removes emoji from string value.

`toTitleCase` - Converts string to Title case format.

### Hocs

`withDataValidation` - Component wrapper to perform validation. Wraps provided component and performs validation. Accepts json schema or Typebox output.

```
import { Type } from "@sinclair/typebox";
import { Page, View } from "@react-pdf/renderer";
import {Typography} from "@ballerine/react-pdf-toolkit"

const Schema =  Type.Object({
title: Type.String()
});

interface IPDFElementProps {
	 data: Static<typeof Schema>
}

const PDFElement = withDataValidation(({data}) =>
<Page>
	<View>
		<Typography>{data.title}</Typography>
	</View>
</Page>,
Schema) // Will throw exception in case if props.data doesnt match schema.
```

### Installation

`pnpm install @ballerine/react-pdf-toolkit`

### Example PDF

```
import { Page, View, Document } from '@react-pdf/renderer';
import {Typography} from '@ballerine/react-pdf-toolkit'

const Example = () => {
	return <Document>
		<Page>
		<View style={tw('flex flex-col')}>
			<Typography weight="bold" size="heading">Hello world!</Typography>
			<View>
				<Typography>I am PDF document.</Typography>
			</View>
		</View>
		</Page>
	</Document>
}
```
