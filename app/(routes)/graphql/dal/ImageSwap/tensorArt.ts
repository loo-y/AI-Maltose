import { tensorArtEndpoint } from '@/app/shared/constants'
import { generateMD5 } from '@/app/shared/util'
import _ from 'lodash'

type TEMPLATE_FIELDS = { fieldAttrs: { nodeId: string; fieldName: string; fieldValue: any }[] }

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
        const response = await fetch(url, {
            ...options,
        })
        const result = await response.json()
        const { name, fields } = (result || {}) as { templateId: string; name: string; fields: TEMPLATE_FIELDS }
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
    fields: TEMPLATE_FIELDS
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
        const response = await fetch(url, {
            ...options,
        })
        const result = await response.json()
        const { job, status } = result || {}
        return {
            job,
            jobStatus: status,
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
    let jobResult: Record<string, any> = {
        status: false,
        jobStatus: ``,
    }
    try {
        const response = await fetch(url, {
            ...options,
        })
        const result = await response.json()
        const { job } = result || {}
        const { status, runningInfo, waitingInfo, failedInfo, successInfo } = job || {}

        if (!_.isEmpty(result)) {
            jobResult = {
                jobId,
                status: true,
                jobStatus: status,
                imageUrl: (status == `SUCCESS` && successInfo?.images?.[0]?.url) || ``,
            }
            return jobResult
        }
        return jobResult
    } catch (e) {
        console.log(`[getJobStatus] error:`, e)
        return {
            ...jobResult,
            errorInfo: e,
            status: false,
        }
    }
}
