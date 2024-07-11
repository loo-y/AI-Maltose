import { tensorArtEndpoint } from '@/app/shared/constants'
import { generateMD5 } from '@/app/shared/util'

const getCommonOptions = (authToken?: string) => {
    return {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authToken ? `Bearer ${authToken}` : '',
        },
    }
}

export const getWorkflowTemplateInfo = async ({
    templateId,
    endpoint = tensorArtEndpoint,
    authToken,
}: {
    templateId: string
    endpoint?: string
    authToken?: string
}) => {
    const url = `https://${endpoint}/v1/workflows/${templateId}`
    const options = {
        ...getCommonOptions(authToken),
        method: 'GET',
    }

    try {
        const response = await fetch('url', {
            ...options,
        })
        const result = await response.json()
        const { name, fields } = result || {}
        return {
            name,
            fields,
            templateId,
            status: true,
        }
    } catch (e) {
        console.log(`[getWorkflowTemplateInfo] error:`, e)
    }

    return {
        templateId: templateId,
        status: false,
    }
}

export const createJobByTemplate = async ({
    templateId,
    endpoint = tensorArtEndpoint,
    fields,
    authToken,
}: {
    templateId: string
    endpoint?: string
    authToken?: string
    fields: { fieldAttrs: { nodeId: string; fieldName: string; fieldValue: any }[] }
}) => {
    const url = `https://${endpoint}/v1/jobs/workflow/template`
    const requestId = await generateMD5(Date.now().toString())

    const body = {
        requestId,
        templateId,
        fields,
    }
    const options = {
        ...getCommonOptions(authToken),
        body: JSON.stringify(body),
    }

    try {
        const response = await fetch('url', {
            ...options,
        })
        const result = await response.json()
        const { job } = result || {}
        return {
            job,
            status: true,
        }
    } catch (e) {
        console.log(`[createJobByTemplate] error:`, e)
    }

    return {
        status: false,
    }
}

export const getJobStatus = async ({
    jobId,
    endpoint = tensorArtEndpoint,
    authToken,
}: {
    jobId: string
    endpoint?: string
    authToken?: string
}) => {
    const url = `https://${endpoint}/v1/jobs/${jobId}`
    const options = {
        ...getCommonOptions(authToken),
        method: 'GET',
    }
    try {
        const response = await fetch('url', {
            ...options,
        })
        const result = await response.json()
        const { job } = result || {}
        return {
            job,
            status: true,
        }
    } catch (e) {
        console.log(`[getJobStatus] error:`, e)
    }
    return {
        status: false,
    }
}
