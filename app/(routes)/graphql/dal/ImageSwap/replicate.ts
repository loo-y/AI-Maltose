import Replicate from 'replicate'

const getReplicateClient = (replicateAPIToken?: string) => {
    if (global.replicateClient) return global.replicateClient
    global.replicateClient = new Replicate({
        auth: replicateAPIToken,
    })

    return global.replicateClient
}

export const getFaceSwap = async ({
    swapImage,
    targetImage,
    replicateAPIToken,
}: {
    swapImage?: string
    targetImage?: string
    replicateAPIToken?: string
}) => {
    if (!swapImage || !targetImage) {
        return {
            status: false,
        }
    }
    const replicateClient = getReplicateClient(replicateAPIToken)
    const output = await replicateClient.run(
        'omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe',
        {
            input: {
                disable_safety_checker: true,
                swap_image: swapImage,
                target_image: targetImage,
            },
        }
    )

    return {
        output,
        status: true,
    }
}
