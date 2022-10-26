<script lang="ts">
  import { Title, ListItem } from '../../atoms';
  import {
    ICSSProperties,
    IElementProps,
    configuration as globalConfiguration,
  } from '../../contexts/configuration';
  import { getFlowName } from '../../contexts/flows';
  import { currentLanguage, T } from '../../contexts/translation';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';
  import { getListLength } from './utils';

  export let configuration: IElementProps;

  const globalListProps = $globalConfiguration.list.listProps as IElementProps;
  const globalListStyles = globalListProps.style as ICSSProperties;
  const titleProps = $globalConfiguration.list.titleProps as IElementProps;
  const listElementProps = $globalConfiguration.list.listElementProps as IElementProps;

  const style = makeStylesFromConfiguration(globalListStyles, configuration.style);

  const flowId = getFlowName();
  const listItems = new Array(getListLength($currentLanguage, `list-${flowId}`)).fill(null);
</script>

<div {style} class="container">
  <Title configuration={titleProps}>
    <T key="title" module={`list-${flowId}`} />
  </Title>
  {#each listItems as item, index}
    <ListItem configuration={listElementProps}>
      <T key={`item-${index + 1}`} module={`list-${flowId}`} />
    </ListItem>
  {/each}
</div>

<style>
  .container {
    margin: var(--margin);
    padding: var(--padding);
    align-items: var(--align-items);
    text-align: var(--text-align);
    justify-content: var(--justify-content);
  }
</style>
