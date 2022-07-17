export const testone = (req, res) => {
  console.log(req.files.file);
  console.log(req.body.taxt);
  res.json({ data: "good" });
};
