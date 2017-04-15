import path from 'path';

const Dir = {
  src: path.resolve(__dirname),
  views: path.resolve(__dirname, 'views'),
  public: path.resolve(__dirname, '..', 'public'),
  build: path.resolve(__dirname, '..', 'public', 'build'),
  static: path.resolve(__dirname, '..', 'public', 'static'),
};

export { Dir };
