const should = require('chai').should(); // eslint-disable-line no-unused-vars
const sinon = require('sinon');

const BemFilter = require('../../../lib/filters/bem');

suite( 'lib/filters/bem', function() {

    const data = require('../../fixtures/complexInitData');
    const filters = require('../../fixtures/bemRules');
    const bemFilter = new BemFilter( { filters: [ filters[ 0 ].default ] } );

    suite( '#_setOrAddAttr', function() {

        test( 'Should set new class attribute if none anabled', function() {
            const res = bemFilter._setOrAddAttr( data.bemOnly['simple-bem'], 'p', 'class', 'b-text' );

            res.should.be.eql('<p class="b-text">Simple paragraph</p>');
        } );

        test( 'Should add class to existed', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple_with_class-bem'],
                'p',
                'class',
                'b-text_type_minor'
            );

            res.should.be.eql('<p class="b-text b-text_type_minor">Simple paragraph</p>');
        } );

        test( 'Should add boolean attribute', function() {
            const res = bemFilter._setOrAddAttr( data.bemOnly['simple_input-bem'], 'input', 'checked' );

            res.should.be.eql('<label><input type="checkbox" checked/>Some label</label>');
        } );

        test( 'Should add attribute', function() {
            const res = bemFilter._setOrAddAttr( data.bemOnly['simple_div-bem'], 'div', 'data-type', 'double' );

            res.should.be.eql('<div class="b-block" data-type="double">Block</div>');
        } );

        test( 'Should not duplicate attribute', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple_div-bem'],
                'div',
                'class',
                'b-block b-block_size_double'
            );

            res.should.be.eql('<div class="b-block b-block_size_double">Block</div>');
        } );

        test( 'Should not duplicate boolean attribute', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple_input_duplicated-bem'],
                'input',
                'checked'
            );

            res.should.be.eql('<label><input type="checkbox" checked/>Some label</label>');
        } );

        test( 'Should not process if condition function returns falsy value', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple-bem'],
                'p',
                'class',
                'b-text',
                () => false
            );

            res.should.be.eql('<p>Simple paragraph</p>');
        } );

        test( 'Should process if condition function returns truthly value', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple-bem'],
                'p',
                'class',
                'b-text',
                () => true
            );

            res.should.be.eql('<p class="b-text">Simple paragraph</p>');
        } );
    } );

    suite( '#_apply', function() {
        let spy;

        beforeEach( function() {
            spy = sinon.spy( bemFilter, '_setOrAddAttr' );
        } );

        afterEach( function() {
            sinon.restore();
        } );

        test( 'Should take tag, attribute and value from specified filter ( case class )', function() {
            bemFilter._apply( data.bemOnly['simple-bem'] );

            spy.calledWith( 'p', 'class', filters[ 0 ].default.classes.p );
        } );

        test( 'Should take tag, attribute and value from specified filter ( case attrs )', function() {
            bemFilter._apply( data.bemOnly['simple_input-bem'] );

            spy.calledWith( 'input', 'checked' );
        } );

        test( 'Should take tag, attribute and value from specified filter ( case ext_ )', function() {
            bemFilter._apply( data.bemOnly['bem_filter_ext-bem'] );

            const spyCallRel = spy.getCall( 0 );
            const spyCallTarget = spy.getCall( 1 );

            spyCallRel.calledWith( 'a', 'rel', filters[ 0 ].default.ext_rel );
            spyCallTarget.calledWith( 'a', 'target', filters[ 0 ].default.ext_target );
        } );
    } );
} );