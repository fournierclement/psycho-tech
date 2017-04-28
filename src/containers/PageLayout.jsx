import React, { Component } from 'react';
import { Link } from 'react-router';
import { HeadBar } from "./HeadBar";

export class PageLayout extends React.Component {
  render() {
    return (
      <div className="Page" >
        <HeadBar />
        <div className="content">
          { this.props.children }
        </div>
      </div>
    );
  }
}
