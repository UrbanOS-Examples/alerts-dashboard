export const STREAMS_URL = process.env.INRIX_STREAM;

export const REQUEST_INRIX_TOPIC = {
    topic: `streaming:${process.env.INRIX_DATASET_SYSTEM_NAME}`,
    event: 'phx_join',
    payload: { api_key: `${process.env.RAPTOR_API_KEY}` },
    ref: '1',
};
