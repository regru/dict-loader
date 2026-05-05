const BemFilter = require('../../../lib/filters/bem');

describe( 'lib/filters/bem', function() {

    const data = require('../../fixtures/complexInitData');
    const filters = require('../../fixtures/bemRules');
    const bemFilter = new BemFilter( { filters: [ filters[ 0 ].default ] } );

    describe( '#_setOrAddAttr', function() {

        it( 'Should set new class attribute if none anabled', function() {
            const res = bemFilter._setOrAddAttr( data.bemOnly['simple-bem'], 'p', 'class', 'b-text' );

            expect( res ).toEqual('<p class="b-text">Simple paragraph</p>');
        } );

        it( 'Should add class to existed', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple_with_class-bem'],
                'p',
                'class',
                'b-text_type_minor'
            );

            expect( res ).toEqual('<p class="b-text b-text_type_minor">Simple paragraph</p>');
        } );

        it( 'Should add boolean attribute', function() {
            const res = bemFilter._setOrAddAttr( data.bemOnly['simple_input-bem'], 'input', 'checked' );

            expect( res ).toEqual('<label><input type="checkbox" checked/>Some label</label>');
        } );

        it( 'Should add attribute', function() {
            const res = bemFilter._setOrAddAttr( data.bemOnly['simple_div-bem'], 'div', 'data-type', 'double' );

            expect( res ).toEqual('<div class="b-block" data-type="double">Block</div>');
        } );

        it( 'Should not duplicate attribute', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple_div-bem'],
                'div',
                'class',
                'b-block b-block_size_double'
            );

            expect( res ).toEqual('<div class="b-block b-block_size_double">Block</div>');
        } );

        it( 'Should not duplicate boolean attribute', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple_input_duplicated-bem'],
                'input',
                'checked'
            );

            expect( res ).toEqual('<label><input type="checkbox" checked/>Some label</label>');
        } );

        it( 'Should not process if condition function returns falsy value', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple-bem'],
                'p',
                'class',
                'b-text',
                () => false
            );

            expect( res ).toEqual('<p>Simple paragraph</p>');
        } );

        it( 'Should process if condition function returns truthly value', function() {
            const res = bemFilter._setOrAddAttr(
                data.bemOnly['simple-bem'],
                'p',
                'class',
                'b-text',
                () => true
            );

            expect( res ).toEqual('<p class="b-text">Simple paragraph</p>');
        } );
    } );

    describe( '#_apply', function() {
        let spy;

        beforeEach( function() {
            spy = vi.spyOn( bemFilter, '_setOrAddAttr' );
        } );

        afterEach( function() {
            vi.restoreAllMocks();
        } );

        it( 'Should take tag, attribute and value from specified filter ( case class )', function() {
            bemFilter._apply( data.bemOnly['simple-bem'] );

            expect( spy ).toHaveBeenCalledWith( expect.anything(), 'p', 'class', filters[ 0 ].default.classes.p );
        } );

        it( 'Should take tag, attribute and value from specified filter ( case ext_ )', function() {
            bemFilter._apply( data.bemOnly['bem_filter_ext-bem'] );

            expect( spy ).toHaveBeenCalledWith(
                expect.stringContaining('https://example.com'),
                'a',
                'rel',
                filters[ 0 ].default.ext_rel,
                expect.any(Function)
            );
            expect( spy ).toHaveBeenCalledWith(
                expect.stringContaining('https://example.com'),
                'a',
                'target',
                filters[ 0 ].default.ext_target,
                expect.any(Function)
            );
        } );
    } );
} );