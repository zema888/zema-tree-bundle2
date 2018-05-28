import { Zema888CatalogPage } from './app.po';

describe('zema888-catalog App', () => {
  let page: Zema888CatalogPage;

  beforeEach(() => {
    page = new Zema888CatalogPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
