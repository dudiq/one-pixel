export default class BaseNode {
  constructor(actions) {
    this.actions = actions;
  }

  render() {
    const actions = this.actions;
    for (let i = 0, l = actions.length; i < l; i++) {
      const data = actions[i];
    }
  }
}
