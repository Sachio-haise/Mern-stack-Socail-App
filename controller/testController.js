export const testone = (req, res) => {
  if (req.file) {
    console.log();
  } else {
    console.log(req.body.file.name);
  }
};
