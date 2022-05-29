// Server Error Response
export const serverError = (error, res) => {
  return res.status(500).send({ error: "Internal Server Error" });
};

//Not Authorized Response
export const notAuthorized = (res, error) => {
  return res.status(401).send({ error: error ? error : "Not Authorized" });
};

//Bad Request Response
export const badRequest = (res, data) => {
  return res.status(400).send(data ? data : { error: "Something Went Wrong" });
};

// Not Found Request
export const notFound = (res, data) => {
  return res.status(404).send(data ? data : { error: "Not Found" });
};
export const alreadyExists = (res, data) => {
  return res.status(409).send(data ? data : { error: "Already Exists" });
};

//Send Reponse Function
export const sendResponse = (res, status, data) => {
  return res.status(status).send(data);
};
