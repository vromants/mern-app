import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {LinksPage} from "./pages/Links";
import {Create} from "./pages/Create";
import {DetailPage} from "./pages/Detail";
import {AuthPage} from "./pages/Auth";
export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path='/links' exact>
                    <LinksPage/>
                </Route>
                <Route path='/create' exact>
                    <Create/>
                </Route>
                <Route path='/detail/:id' exact>
                    <DetailPage/>
                </Route>
                <Redirect to='/create'/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path='/' exact>
                <AuthPage/>
            </Route>
            <Redirect to='/'/>
        </Switch>
    )
}