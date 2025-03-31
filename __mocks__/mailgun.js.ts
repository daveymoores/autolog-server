const mockMailgun = jest.fn().mockImplementation(() => {
  return {
    client: jest.fn().mockReturnValue({
      messages: {
        create: jest
          .fn()
          .mockResolvedValue({ id: "mock-id", message: "Queued. Thank you." }),
      },
    }),
  };
});

export default mockMailgun;
