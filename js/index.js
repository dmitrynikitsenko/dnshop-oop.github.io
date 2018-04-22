const model = new Model;
const view = new View('root');
const controller = new Controller(view, model);

view.handleCategories(0, DATA);