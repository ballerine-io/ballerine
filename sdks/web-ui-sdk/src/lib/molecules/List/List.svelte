<script lang="ts">
  import { ListItem, Title } from '../../atoms';
  import {
    configuration as globalConfiguration,
    IElementProps,
  } from '../../contexts/configuration';
  import { getFlowName } from '../../contexts/flows';
  import { currentLanguage, T, TranslationType } from '../../contexts/translation';
  import { ICSSProperties, makeStylesFromConfiguration } from '../../services/css-manager';
  import { getListLength } from './utils';
  import { uiPack } from '../../ui-packs';

  export let configuration: IElementProps;

  const globalListProps =
    ($globalConfiguration.components?.list?.listProps as IElementProps) ||
    $uiPack?.components?.list?.listProps ||
    {};
  const globalListStyles = globalListProps?.style as ICSSProperties;
  const titleProps =
    ($globalConfiguration.components?.list?.titleProps as IElementProps) ||
    $uiPack?.components?.list?.titleProps ||
    {};
  const listElementProps =
    ($globalConfiguration.components?.list?.listElementProps as IElementProps) ||
    $uiPack?.components?.list?.listElementProps ||
    {};

  const style = makeStylesFromConfiguration(globalListStyles, configuration.style);

  const flowId = getFlowName();
  // There's no list-${flowId} key in the translations json.
  const listItems = new Array(
    getListLength($currentLanguage, `list-${flowId}` as TranslationType[typeof $currentLanguage]),
  ).fill(null);
</script>

<div {style} class="container">
  <Title configuration={titleProps}>
    <T key="title" namespace={`list-${flowId}`} />
  </Title>
  {#each listItems as item, index}
    <ListItem configuration={listElementProps}>
      <T key={`item-${index + 1}`} namespace={`list-${flowId}`} />
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
