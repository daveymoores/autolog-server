const mockConnectToDb = jest.fn().mockResolvedValue({
  mongoCollection: {
    updateOne: jest.fn().mockResolvedValue({}),
  },
});

export default mockConnectToDb;
