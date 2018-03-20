// Copyright 2018 Johannes Wilm
// Copyright 2005 Google Inc.
// All Rights Reserved
//
// Debug stuff for the XPath parser. Also used by XSLT.
import {
    XNode
} from "../src/dom.js"
import {
    ExprContext,
    StringValue,
    BooleanValue,
    NumberValue,
    NodeSetValue,
    TokenExpr,
    LocationExpr,
    StepExpr,
    NodeTestName,
    NodeTestNC,
    NodeTestComment,
    NodeTestPI,
    NodeTestText,
    NodeTestElementOrAttribute,
    NodeTestAny,
    PredicateExpr,
    FunctionCallExpr,
    UnionExpr,
    PathExpr,
    FilterExpr,
    UnaryMinusExpr,
    BinaryExpr,
    LiteralExpr,
    NumberExpr,
    VariableExpr
} from "../src/xpath.js"

TokenExpr.prototype.toString = function() {
    return this.value;
}

TokenExpr.prototype.parseTree = function(indent) {
    const ret = `${indent}[token] ${this.value}\n`;
    return ret;
}

LocationExpr.prototype.toString = function() {
    let ret = '';
    if (this.absolute) {
        ret += '/';
    }
    for (let i = 0; i < this.steps.length; ++i) {
        if (i > 0) {
            ret += '/';
        }
        ret += this.steps[i].toString();
    }
    return ret;
}

LocationExpr.prototype.parseTree = function(indent) {
    let ret = `${indent}[location] ${this.absolute ? 'absolute' : 'relative'}\n`;
    for (let i = 0; i < this.steps.length; ++i) {
        ret += this.steps[i].parseTree(`${indent} `);
    }
    return ret;
}

StepExpr.prototype.toString = function() {
    let ret = `${this.axis}::${this.nodetest.toString()}`;
    for (let i = 0; i < this.predicate.length; ++i) {
        ret += this.predicate[i].toString();
    }
    return ret;
}

StepExpr.prototype.parseTree = function(indent) {
    let ret = `${indent}[step]\n${indent} [axis] ${this.axis}\n${this.nodetest.parseTree(indent + ' ')}`;
    for (let i = 0; i < this.predicate.length; ++i) {
        ret += this.predicate[i].parseTree(`${indent} `);
    }
    return ret;
}

NodeTestAny.prototype.toString = () => 'node()'

NodeTestAny.prototype.parseTree = function(indent) {
    return `${indent}[nodetest] ${this.toString()}\n`;
}

NodeTestElementOrAttribute.prototype.toString = () => '*'

NodeTestElementOrAttribute.prototype.parseTree = NodeTestAny.prototype.parseTree;

NodeTestText.prototype.toString = () => 'text()'

NodeTestText.prototype.parseTree = NodeTestAny.prototype.parseTree;

NodeTestComment.prototype.toString = () => 'comment()'

NodeTestComment.prototype.parseTree = NodeTestAny.prototype.parseTree;

NodeTestPI.prototype.toString = () => 'processing-instruction()'

NodeTestPI.prototype.parseTree = NodeTestAny.prototype.parseTree;

NodeTestNC.prototype.toString = function() {
    return `${this.nsprefix}:*`;
}

NodeTestNC.prototype.parseTree = NodeTestAny.prototype.parseTree;

NodeTestName.prototype.toString = function() {
    return this.name;
}

NodeTestName.prototype.parseTree = NodeTestAny.prototype.parseTree;

PredicateExpr.prototype.toString = function() {
    const ret = `[${this.expr.toString()}]`;
    return ret;
}

PredicateExpr.prototype.parseTree = function(indent) {
    const ret = `${indent}[predicate]\n${this.expr.parseTree(indent + ' ')}`;
    return ret;
}

FunctionCallExpr.prototype.toString = function() {
    let ret = `${this.name.value}(`;
    for (let i = 0; i < this.args.length; ++i) {
        if (i > 0) {
            ret += ', ';
        }
        ret += this.args[i].toString();
    }
    ret += ')';
    return ret;
}

FunctionCallExpr.prototype.parseTree = function(indent) {
    let ret = `${indent}[function call] ${this.name.value}\n`;
    for (let i = 0; i < this.args.length; ++i) {
        ret += this.args[i].parseTree(`${indent} `);
    }
    return ret;
}

UnionExpr.prototype.toString = function() {
    return `${this.expr1.toString()} | ${this.expr2.toString()}`;
}

UnionExpr.prototype.parseTree = function(indent) {
    const ret = `${indent}[union]\n${this.expr1.parseTree(indent + ' ')}${this.expr2.parseTree(indent + ' ')}`;
    return ret;
}

PathExpr.prototype.toString = function() {
    const ret = `{path: {${this.filter.toString()}} {${this.rel.toString()}}}`;
    return ret;
}

PathExpr.prototype.parseTree = function(indent) {
    const ret = `${indent}[path]\n${indent}- filter:\n${this.filter.parseTree(indent + ' ')}${indent}- location path:\n${this.rel.parseTree(indent + ' ')}`;
    return ret;
}

FilterExpr.prototype.toString = function() {
    let ret = this.expr.toString();
    for (let i = 0; i < this.predicate.length; ++i) {
        ret += this.predicate[i].toString();
    }
    return ret;
}

FilterExpr.prototype.parseTree = function(indent) {
    let ret = `${indent}[filter]\n${indent}- expr:\n${this.expr.parseTree(indent + ' ')}`;
    `${indent}- predicates:\n`;
    for (let i = 0; i < this.predicate.length; ++i) {
        ret += this.predicate[i].parseTree(`${indent} `);
    }
    return ret;
}

UnaryMinusExpr.prototype.toString = function() {
    return `-${this.expr.toString()}`;
}

UnaryMinusExpr.prototype.parseTree = function(indent) {
    return `${indent}[unary] -\n${this.expr.parseTree(indent + ' ')}`;
}

BinaryExpr.prototype.toString = function() {
    return `${this.expr1.toString()} ${this.op.value} ${this.expr2.toString()}`;
}

BinaryExpr.prototype.parseTree = function(indent) {
    return `${indent}[binary] ${this.op.value}\n${this.expr1.parseTree(indent + ' ')}${this.expr2.parseTree(indent + ' ')}`;
}

LiteralExpr.prototype.toString = function() {
    return `"${this.value}"`;
}

LiteralExpr.prototype.parseTree = function(indent) {
    return `${indent}[literal] ${this.toString()}\n`;
}

NumberExpr.prototype.toString = function() {
    return `${this.value}`;
}

NumberExpr.prototype.parseTree = function(indent) {
    return `${indent}[number] ${this.toString()}\n`;
}

VariableExpr.prototype.toString = function() {
    return `$${this.name}`;
}

VariableExpr.prototype.parseTree = function(indent) {
    return `${indent}[variable] ${this.toString()}\n`;
}

XNode.prototype.toString = function() {
    return this.nodeName;
}

ExprContext.prototype.toString = function() {
    return `[${this.position}/${this.nodelist.length}] ${this.node.nodeName}`;
}

function Value_toString() {
    return `${this.type}: ${this.value}`;
}

StringValue.prototype.toString = Value_toString;
NumberValue.prototype.toString = Value_toString;
BooleanValue.prototype.toString = Value_toString;
NodeSetValue.prototype.toString = Value_toString;