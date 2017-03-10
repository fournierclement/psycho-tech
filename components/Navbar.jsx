import React from "react";
import ReactDom from "react-dom";


export const Navbar = ({user, page}) => (
  <div id="Navbar">
    <nav className="ui left vertical inverted labeled icon thin sidebar menu">
      <a className={ page === "Accueil" ? "active item" : "item" } href="">
        <i className="home icon"></i>
        Accueil
      </a>
      { user && ( !user.admin ? (
        <a className={ page === "Questionnaire" ? "active item" : "item" } href="">
          <i class="info icon"></i>
          Questionnaire
        </a>
      ) : (
        <a className={ page === "Statistiques" ? "active item" : "item" } href="">
          <i class="bar chart icon"></i>
          Statistiques
        </a>
        <a className={ page === "Dashboard" ? "active item" : "item" } href="">
          <i class="dashboard icon"></i>
          Dashboard
        </a>
      ))}
      { user ? (
        <a className={ page === "Mon Profil" ? "active item" : "item" } href="">
          <i class="user icon"></i>
          Mon Profil
        </a>
        <a className={ page === "Déconnexion" ? "active item" : "item" } href="">
          <i class="sign out icon"></i>
          Déconnexion
        </a>
      ) : (
        <a className={ page === "S\'enregistrer" ? "active item" : "item" } href="">
          <i class="save icon"></i>
          S'enregistrer
        </a>
        <a className={ page === "Connexion" ? "active item" : "item" } href="">
          <i class="sign in icon"></i>
          Connexion
        </a>
      )}
      { user && user.admin && (
        <a href="https://kevinhassan.github.io/riasec/" title="documentation" class="item"><i class="book icon"></i> Documentation </a>
      )}
    </nav>
    <nav class="ui fixed inverted menu">
      <div class="ui container">
        <div class="ui compact icon large secondary inverted pointing menu">
        <a class="toc item">
          <i class="sidebar icon"></i>
          <span class="text"> Menu </span>
        </a>
          { user && ( !user.admin ? (
            <a className={ page === "Questionnaire" ? "active item" : "item" } href="">
              <i class="info icon"></i>
              Questionnaire
            </a>
          ) : (
            <a className={ page === "Statistiques" ? "active item" : "item" } href="">
              <i class="bar chart icon"></i>
              Statistiques
            </a>
          ))}
        </div>
        <div class="right menu">
          { user && user.admin && (
            <a className={ page === "Dashboard" ? "active item" : "item" } href="">
              <i class="dashboard icon"></i>
              Dashboard
            </a>
          )}
          { user ? (
            <a className={ page === "Mon Profil" ? "active item" : "item" } href="">
              <i class="user icon"></i>
              Mon Profil
            </a>
            <a className={ page === "Déconnexion" ? "active item" : "item" } href="">
              <i class="sign out icon"></i>
              Déconnexion
            </a>
          ) : (
            <a className={ page === "S\'enregistrer" ? "active item" : "item" } href="">
              <i class="save icon"></i>
              S'enregistrer
            </a>
            <a className={ page === "Connexion" ? "active item" : "item" } href="">
              <i class="sign in icon"></i>
              Connexion
            </a>
            { user && user.admin && (
              <a href="https://kevinhassan.github.io/riasec/" title="documentation" class="item"><i class="book icon"></i> Documentation </a>
            )}
          )}
        </div>
      </div>
    </nav>
  </div>
)
