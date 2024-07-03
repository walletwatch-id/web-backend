export interface UseCase<S, T extends unknown[] = []> {
  execute(...[param]: T): S;
}
