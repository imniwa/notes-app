export const confirmJWT = async (
  bearer: any,
  jwt: any
): Promise<{ id: string }> => {
  const payload = await jwt.verify(bearer);
  if (typeof payload === "boolean" || !("id" in payload)) {
    throw new Error("Invalid JWT payload");
  }
  const { id } = payload;
  return { id };
};
