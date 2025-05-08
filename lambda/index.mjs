export const handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World from Lambda!',
      event: event
    }),
  };
};
