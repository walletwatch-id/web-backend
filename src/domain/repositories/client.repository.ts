export interface ClientRepository {
  getSidebarExtendedState(): boolean;
  setSidebarExtendedState(state: boolean): void;
}
