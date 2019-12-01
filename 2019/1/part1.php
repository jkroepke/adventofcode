#!/usr/bin/env php
<?php

/*
 * Fuel required to launch a given module is based on its mass.
 * Specifically, to find the fuel required for a module, take its mass,
 * divide by three,
 * round down,
 * and subtract 2.
 *
 * 3366413
 * 3366415 <<-
 */

$lines = file('input.txt');

echo array_reduce($lines, function ($sum, $mass) {
    $sum += floor($mass / 3) - 2;
    return $sum;
}, 0), "\n";
