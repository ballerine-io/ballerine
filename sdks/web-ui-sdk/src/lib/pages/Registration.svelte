<!-- <script lang="ts">
  import { createForm } from "svelte-forms-lib";
  import { useNavigate } from 'svelte-navigator';
  import { T } from '../contexts/translation';
  import { Button, Title, Paragraph, IconButton } from '../atoms';
  import { getConfiguration, IStepConfiguration, Steps, IFormProps } from '../contexts/configuration';
  import { goToNextStep } from '../contexts/navigation/hooks';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from "../utils/css-utils";
  import Input from '../atoms/Input/Input.svelte';
  import { getDefaultValues, setValuesFromStore } from "../utils/form-utils";

  const configuration = getConfiguration();

  const step = configuration.steps.find(s => s.name === Steps.Registration) as IStepConfiguration;
  const style = makeStylesFromConfiguration(configuration.layout, step.style);
  const formProps = step.form as IFormProps;

  const navigate = useNavigate();

  const onSubmit = async (values: Record<string, string>) => {
    if (formProps.action === 'store') {
      setValuesFromStore(formProps, values);
      goToNextStep(step, navigate, configuration);
      return;
    }
    const apiUrl = formProps.apiUrl as string;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        mode:'no-cors',
        'Content-Type': 'application/json'
      },
        body: JSON.stringify(values)
      })
    console.log(res);
    goToNextStep(step, navigate, configuration);
  }

  const { form, handleSubmit, handleChange } = createForm({
    initialValues: getDefaultValues(step, formProps),
    onSubmit
  });
</script>


<form on:submit={handleSubmit} class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton configuration={element.props} />
    {/if}
    {#if element.type === Elements.Input}
      <Input
        form={form}
        configuration={element.props}
        on:change={handleChange}
        translationContext="registration"
      />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" namespace="registration" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key="description" namespace="registration" />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Button}
      <Button configuration={element.props}>
        <T key="button" namespace="registration" />
      </Button>
    {/if}
  {/each}
</form>


<style>
  .container {
    height: 100%;
    padding: var(--padding);
    position: var(--position);
    background: var(--background);
    text-align: center;
  }
</style> -->
