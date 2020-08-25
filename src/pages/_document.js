import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import TagManager from 'pages/components/TagManager'
import DashboardDocument from 'pages/dashboard/_document'
import SignupDocument from 'pages/signup/_document'
import css from 'styles/home.scss'

const addStyles = () => ({ __html: css })

export default class DocDoc extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        const isDashboard = ctx.req.path.startsWith('/dashboard')
        const isSignup = ctx.req.path.startsWith('/signup')
        let dashboardProps = {}
        let signupProps = {}

        if (isDashboard) {
            dashboardProps = await DashboardDocument.getInitialProps(ctx)
            return { ...initialProps, ...dashboardProps, isDashboard }
        }
        if (isSignup) {
            signupProps = await SignupDocument.getInitialProps(ctx)
            return { ...initialProps, ...signupProps, isSignup }
        }
        return { ...initialProps }
    }

    render() {
        if (this.props.isDashboard) {
            return <DashboardDocument {...this.props} />
        }
        if (this.props.isSignup) {
            return <DashboardDocument {...this.props} />
        }

        return (
            <html lang="pt-BR">
                <Head>
                    <script src="/static/js/newrelic-browser.js" />
                    <TagManager />
                    <style dangerouslySetInnerHTML={addStyles()} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}