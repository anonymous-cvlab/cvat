/*
 * Copyright (C) 2020 Intel Corporation
 *
 * SPDX-License-Identifier: MIT
 */

/// <reference types="cypress" />

context('Check if the image is scaled and then fitted', () => {

    const caseId = '6'
    const labelName = `Case ${caseId}`
    const taskName = `New annotation task for ${labelName}`
    const attrName = `Attr for ${labelName}`
    const textDefaultValue = 'Some default value for type Text'
    const imageFileName = `image_${labelName.replace(' ', '_').toLowerCase()}`
    const image = `${imageFileName}.png`
    const width = 800
    const height = 800
    const posX = 10
    const posY = 10
    const color = 'gray'
    let scaleBefore = 0
    let scaleAfter = 0

    before(() => {
        cy.visit('auth/login')
        cy.login()
        cy.imageGenerator('cypress/fixtures', image, width, height, color, posX, posY, labelName)
        cy.createAnnotationTask(taskName, labelName, attrName, textDefaultValue, image)
        cy.openTaskJob(taskName)
    })

    describe(`Testing "${labelName}"`, () => {
        it('Scale image', () => {
            cy.get('#cvat_canvas_background')
            .should('have.attr', 'style')
            .then($styles => {
                scaleBefore = Number($styles.match(/scale\((\d\.\d+)\)/m)[1])
            })
            cy.get('.cvat-canvas-container')
            .trigger('wheel', {deltaY: 5})
            cy.get('#cvat_canvas_background')
            .should('have.attr', 'style')
            .then($styles => {
                scaleAfter = Number($styles.match(/scale\((\d\.\d+)\)/m)[1])
                cy.expect(scaleBefore).to.be.greaterThan(scaleAfter)
            })
        })
        it('Fit image', () => {
            cy.get('#cvat_canvas_content')
            .dblclick()
            cy.get('#cvat_canvas_background')
            .should('have.attr', 'style').and('contain', scaleBefore)
        })
    })
})
