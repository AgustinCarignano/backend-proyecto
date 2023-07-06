export function verifyDocuments(req, res, next) {
  const user = req.user;
  if (!user.documents) return res.render("upgradeError");
  const essentialDocuments = ["identification", "address", "account"];
  const existingDocuments = user.documents.map((item) => item.name);
  let hasToUpgrade = true;
  essentialDocuments.forEach((item) => {
    if (!existingDocuments.includes(item)) hasToUpgrade = false;
  });
  if (hasToUpgrade) {
    return next();
  } else {
    return res.render("upgradeError");
  }
}
