import React, { Component } from 'react';
import { Link } from 'react-router';
import { Footer } from "./Footer";
import { HeadBar } from "./HeadBar";

export class PageLayout extends React.Component {

  static fetchData() {} // will be used for server side rendering

  render() {
    return (
      <div className="Page" >
        <HeadBar />
        <div className="content">
          { this.props.children }
        </div>
        <Footer />
      </div>
    );
  }
}
