{{/*
Expand the name of the chart.
*/}}
{{- define "wf-service.name" -}}
{{- default .Chart.Name .Values.workflowService.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "wf-service.fullname" -}}
{{- if .Values.workflowService.fullnameOverride }}
{{- .Values.workflowService.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.workflowService.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "wf-service.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "wf-service.labels" -}}
helm.sh/chart: {{ include "wf-service.chart" . }}
{{ include "wf-service.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "wf-service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "wf-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "wf-service.serviceAccountName" -}}
{{- if .Values.workflowService.serviceAccount.create }}
{{- default (include "wf-service.fullname" .) .Values.workflowService.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.workflowService.serviceAccount.name }}
{{- end }}
{{- end }}
