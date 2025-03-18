export function mapAll<T, K>(data: T[], callback: (data: T) => K): K[] {
  const objects: K[] = [];

  for (let i = 0; i < data.length; i++) {
    objects.push(callback(data[i]));
  }

  return objects;
}
