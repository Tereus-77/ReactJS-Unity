import React from 'react';

export function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}