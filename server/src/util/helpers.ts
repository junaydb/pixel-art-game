export function getParentDir(path: string) {
  const dirs = path.split("/");
  dirs.pop();
  return dirs.join("/");
}


// exclusive
export function randInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
