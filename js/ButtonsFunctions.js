//var buttonOp;
function R_Cpk() {
    return function(event) {
        CambiarRepresentacion("Cpk");
    }
}

function R_SB() {
    return function(event) {
        CambiarRepresentacion("SB");
    }
}

function R_B() {
    return function(event) {
        CambiarRepresentacion("B");
    }
}

function ByAmino(mol, name) {
    return function(event) {
        AtomosSeleccionados = [];
        for (var i = 0; i < molecule.LstChain.length; i++) {
            for (var j = 0; j < molecule.LstChain[i].LstAminoAcid.length; j++) {
                if (molecule.LstChain[i].LstAminoAcid[j].Name == name) {
                    for (var k = 0; k < molecule.LstChain[i].LstAminoAcid[j].LstAtoms.length; k++) {
                        AtomosSeleccionados.push(molecule.LstChain[i].LstAminoAcid[j].LstAtoms[k]);
                    }
                }
            }
        }
        ProcesarSeleccion();

    }

}

function ByAtoms(mol, element) {
    return function(event) {
        AtomosSeleccionados = [];
        for (var i = 0; i < molecule.LstAtoms.length; i++) {
            //alert(molecule.LstAtoms[i].Element);
            if (element == molecule.LstAtoms[i].Element) {
                if (molecule.LstAtoms[i].State == 'Active') {
                    AtomosSeleccionados.push(molecule.LstAtoms[i]);
                }

            }
        }
        ProcesarSeleccion();


    }
}

function ProcesarSeleccion() {
    console.time("procesarSeleccion");
    for (var t = 0; t < AtomosSeleccionados.length; t++) {
        var atom = AtomosSeleccionados[t];
        if (atom.Seleccionado == false) {
            //
            atom.Seleccionado = true;
            haySeleccionado = true;

            if (NBW == 0) //es el primero que voy a agregar al objeto Solid
            {
                NBW = 1;
                LstBW[0] = new Array();
            } else {
                //---------------agregarlo a la cola en el wire
                if (LstBW[NBW - 1].length == NoPaso) {
                    NBW += 1;
                    LstBW[NBW - 1] = new Array();
                    wirePositionData[NBW - 1] = new Array();
                    wirenormalDataN[NBW - 1] = new Array();
                    wireColorTotal[NBW - 1] = new Array();
                    wireindexData[NBW - 1] = new Array();

                    ChainIndexW[NBW - 1] = new Array();

                    sphereWirePositionBuffer[NBW - 1] = new Array();
                    sphereWireColorBuffer[NBW - 1] = new Array();
                    sphereWireIndexBuffer[NBW - 1] = new Array();
                    sphereWireNormalBuffer[NBW - 1] = new Array();

                    ChainBufferW[NBW - 1] = new Array();
                }

            }
            LstBW[NBW - 1].push(atom);
            atom.BloqueWire = NBW;
            atom.PositionBWire = LstBW[NBW - 1].length;

            /////////////////////////////////////////////////// VERTICES    //////////////////////////////////////////
            if (atom.Representation == "SB") {
                for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                {
                    wirePositionData[NBW - 1].push(verArray[z] + atom.X - Cx);
                    wirePositionData[NBW - 1].push(verArray[z + 1] + atom.Y - Cy);
                    wirePositionData[NBW - 1].push(verArray[z + 2] + atom.Z - Cz);

                    wirenormalDataN[NBW - 1].push(normalData[z]);
                    wirenormalDataN[NBW - 1].push(normalData[z + 1]);
                    wirenormalDataN[NBW - 1].push(normalData[z + 2]);

                    z = z + 3;
                }

            } else if (atom.Representation == "CPK") {
                //alert(89999);
                if (atom.NameAtom == 'H') {
                    for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                    {
                        wirePositionData[NBW - 1].push(verArrayH[z] + atom.X - Cx);
                        wirePositionData[NBW - 1].push(verArrayH[z + 1] + atom.Y - Cy);
                        wirePositionData[NBW - 1].push(verArrayH[z + 2] + atom.Z - Cz);

                        wirenormalDataN[NBW - 1].push(normalData[z]);
                        wirenormalDataN[NBW - 1].push(normalData[z + 1]);
                        wirenormalDataN[NBW - 1].push(normalData[z + 2]);

                        z = z + 3;
                    }
                } else if (atom.NameAtom == 'C') {
                    for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                    {
                        wirePositionData[NBW - 1].push(verArrayC_PB_TI_CA[z] + atom.X - Cx);
                        wirePositionData[NBW - 1].push(verArrayC_PB_TI_CA[z + 1] + atom.Y - Cy);
                        wirePositionData[NBW - 1].push(verArrayC_PB_TI_CA[z + 2] + atom.Z - Cz);

                        wirenormalDataN[NBW - 1].push(normalData[z]);
                        wirenormalDataN[NBW - 1].push(normalData[z + 1]);
                        wirenormalDataN[NBW - 1].push(normalData[z + 2]);

                        z = z + 3;
                    }


                } else /////////// DEFAULT
                {
                    for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                    {
                        wirePositionData[NBW - 1].push(verArrayC_PB_TI_CA[z] + atom.X - Cx);
                        wirePositionData[NBW - 1].push(verArrayC_PB_TI_CA[z + 1] + atom.Y - Cy);
                        wirePositionData[NBW - 1].push(verArrayC_PB_TI_CA[z + 2] + atom.Z - Cz);

                        wirenormalDataN[NBW - 1].push(normalData[z]);
                        wirenormalDataN[NBW - 1].push(normalData[z + 1]);
                        wirenormalDataN[NBW - 1].push(normalData[z + 2]);

                        z = z + 3;
                    }

                }


            } else {

            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////


            //alert(99);                       
            for (var i = 0; i < nColor;) {
                wireColorTotal[NBW - 1].push(atom.ColorRGB[0]);
                wireColorTotal[NBW - 1].push(atom.ColorRGB[1]);
                wireColorTotal[NBW - 1].push(atom.ColorRGB[2]);
                wireColorTotal[NBW - 1].push(atom.ColorRGB[3]);
                i = i + 4;

                ChainIndexW[NBW - 1].push(atom.idChain);
                ChainIndexW[NBW - 1].push(atom.idChain);
            }
            //alert(nIndices);
            for (var i = 0; i < nIndices; i++) {
                //tengo que saber en qué posicion se encuentra
                wireindexData[NBW - 1].push(indicesSphere[i] + (289 * (LstBW[NBW - 1].length - 1)));
            }

            ///////////////////---------------Quitar el átomo del ObjetoSolid ///////////////////////////////////////////////////////

            //////////--------------el atomo seleccionado es el último del objeto Solido-----------------//////////
            if (atom.BloqueSolid == NBS && atom.PositionBSolid == LstBS[NBS - 1].length) //mandar la alerta para checar si esto está bien
            { //las posiciones van desde 0, 
                //quitar el atom solid
                //alert("el atomo seleccionado es el ultimo del objeto solido");
                vertexPositionData[NBS - 1].splice((atom.PositionBSolid - 1) * nVertices, nVertices);
                normalDataN[NBS - 1].splice((atom.PositionBSolid - 1) * nVertices, nVertices);
                ColorTotal[NBS - 1].splice((atom.PositionBSolid - 1) * nColor, nColor);
                indexData[NBS - 1].splice((atom.PositionBSolid - 1) * nIndices, nIndices);
                ChainIndex[NBS - 1].splice((atom.PositionBSolid - 1) * nChain, nChain);

                LstBS[NBS - 1].pop() //se quita el atom del solid

            }
            //////////--------------el atomo seleccionado no es el último el los bloques Solid-----------------//////////
            else {
                //alert("el atomo seleccionado no es el ultimo del objeto solido");                                                          
                //voy a eliminar este atom y además voy a agregar el que está en la cola del solid a esta posición
                var mulVertex = (atom.PositionBSolid - 1) * nVertices; ///////////////////
                //console.time("spliceForVertices");
                for (var i = 0; i < nVertices; i++) {
                    vertexPositionData[atom.BloqueSolid - 1][mulVertex + i] = vertexPositionData[NBS - 1][vertexPositionData[NBS - 1].length - nVertices + i];
                    //vertexPositionData[atom.BloqueSolid-1].splice(mulVertex +i, 1, vertexPositionData[NBS-1][vertexPositionData[NBS-1].length - nVertices + i ] );

                    normalDataN[atom.BloqueSolid - 1][mulVertex + i] = normalDataN[NBS - 1][normalDataN[NBS - 1].length - nVertices + i];
                    //normalDataN[atom.BloqueSolid-1].splice( mulVertex +i,       1, normalDataN[NBS-1][normalDataN[NBS-1].length - nVertices + i ] );     
                }
                //console.timeEnd("spliceForVertices");
                var mulColor = (atom.PositionBSolid - 1) * nColor; ///////////////////                       
                for (var i = 0; i < nColor; i++) {
                    ColorTotal[atom.BloqueSolid - 1][mulColor + i] = ColorTotal[NBS - 1][ColorTotal[NBS - 1].length - nColor + i];
                    //ColorTotal[atom.BloqueSolid-1].splice( mulColor +i,            1, ColorTotal[NBS-1][ColorTotal[NBS-1].length - nColor + i ] );  
                }

                var mulChain = (atom.PositionBSolid - 1) * nChain; ///////////////////
                for (var i = 0; i < nChain; i++) {
                    ChainIndex[atom.BloqueSolid - 1][mulChain + i] = ChainIndex[NBS - 1][ChainIndex[NBS - 1].length - nChain + i];
                    //ChainIndex[atom.BloqueSolid - 1].splice( mulChain + i, 1, ChainIndex[NBS - 1][ChainIndex[NBS - 1].length - nChain + i]);
                }


                //los índices sólo quito los indices últimos del último bloque
                indexData[NBS - 1].splice(indexData[NBS - 1].length - nIndices, nIndices);

                //ahora eliminar el que tenía en la cola
                vertexPositionData[NBS - 1].splice(vertexPositionData[NBS - 1].length - nVertices, nVertices);
                normalDataN[NBS - 1].splice(normalDataN[NBS - 1].length - nVertices, nVertices);
                ColorTotal[NBS - 1].splice(ColorTotal[NBS - 1].length - nColor, nColor);
                ChainIndex[NBS - 1].splice(ChainIndex[NBS - 1].length - nChain, nChain);

                LstBS[NBS - 1][LstBS[NBS - 1].length - 1].BloqueSolid = atom.BloqueSolid;
                LstBS[NBS - 1][LstBS[NBS - 1].length - 1].PositionBSolid = atom.PositionBSolid;
                LstBS[atom.BloqueSolid - 1].splice(atom.PositionBSolid - 1, 1, LstBS[NBS - 1][LstBS[NBS - 1].length - 1]) //se quita el atom del solid y se agrega el de la cola
                LstBS[NBS - 1].pop();
                //alert(98888);


                if (LstBS[NBS - 1].length == 0) {
                    NBS -= 1;
                }

            }


        } else {
            //No hacer nada xq ya está seleccionado

        }
    }
    for (var i = 0; i < NBW; i++) {
        sphereWirePositionBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wirePositionData[i]), gl.DYNAMIC_DRAW);
        sphereWirePositionBuffer[i].itemSize = 3;
        sphereWirePositionBuffer[i].numItems = (wirePositionData[i].length / 3) * 1;
        //alert(54);
        sphereWireColorBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireColorBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wireColorTotal[i]), gl.DYNAMIC_DRAW);
        sphereWireColorBuffer[i].itemSize = 4;
        sphereWireColorBuffer[i].numItems = (wireColorTotal[i].length / 4) * 1;
        //alert(64);

        ChainBufferW[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ChainBufferW[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndexW[i]), gl.DYNAMIC_DRAW);
        ChainBufferW[i].itemSize = 2;
        ChainBufferW[i].numItems = (ChainIndexW[i].length / 2) * 1;

        sphereWireIndexBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereWireIndexBuffer[i]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(wireindexData[i]), gl.DYNAMIC_DRAW);
        sphereWireIndexBuffer[i].itemSize = 1;
        sphereWireIndexBuffer[i].numItems = (wireindexData[i].length / 1) * 1;

        sphereWireNormalBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireNormalBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wirenormalDataN[i]), gl.DYNAMIC_DRAW);
        sphereWireNormalBuffer[i].itemSize = 3;
        sphereWireNormalBuffer[i].numItems = (wirenormalDataN[i].length / 3) * 1;


    }
    for (var i = 0; i < NBS; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[i]), gl.DYNAMIC_DRAW);
        sphereVertexPositionBuffer[i].itemSize = 3;
        sphereVertexPositionBuffer[i].numItems = (vertexPositionData[i].length / 3) * 1;

        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[i]), gl.DYNAMIC_DRAW);
        sphereVertexColorBuffer[i].itemSize = 4;
        sphereVertexColorBuffer[i].numItems = ColorTotal[i].length / 4;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[i]), gl.DYNAMIC_DRAW);
        ChainBuffer[i].itemSize = 2;
        ChainBuffer[i].numItems = (ChainIndex[i].length / 2) * 1;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[i]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[i]), gl.DYNAMIC_DRAW);
        sphereVertexIndexBuffer[i].itemSize = 1;
        sphereVertexIndexBuffer[i].numItems = indexData[i].length;

        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[i]), gl.DYNAMIC_DRAW);
        sphereVertexNormalBuffer[i].itemSize = 3;
        sphereVertexNormalBuffer[i].numItems = normalDataN[i].length / 3;


    }

    console.timeEnd("procesarSeleccion");

}


function ProcesarCadena(index, button) {
    return function(event) {
        if (molecule.LstChain[index].State == 'Inactive') {
            button.style.color = ' #ffffff ';
            molecule.LstChain[index].State = 'Active'

            var pos = index + 1;

            for (var k = 0; k < ArrayIndx.length; k++) {
                if (pos == ArrayIndx[k]) {
                    ArrayIndx.splice(k, 1);
                }

            }
            ArrayIndx.push(0);

            var u_Array = gl.getUniformLocation(program, 'uIntArray');

            gl.uniform1fv(u_Array, ArrayIndx);

            ArrayIndx.pop();


            for (var i = 0; i < molecule.LstChain[index].LstAminoAcid.length; i++) {
                for (var j = 0; j < molecule.LstChain[index].LstAminoAcid[i].LstAtoms.length; j++) {
                    var at = molecule.LstChain[index].LstAminoAcid[i].LstAtoms[j];
                    //voy a checar cada uno para ver si está en wire o en solid
                    //alert(ColorTotal[at.BloqueSolid-1]);
                    //alert(at.NameAtom);
                    at.State = 'Active';
                   
                }
            }

        } else {
            button.style.color = ' rgb(255,0,0) ';
            molecule.LstChain[index].State = 'Inactive'


            ArrayIndx.push(index + 1);

            //alert(ArrayIndx);

            var u_Array = gl.getUniformLocation(program, 'uIntArray');

            gl.uniform1fv(u_Array, ArrayIndx);

            for (var i = 0; i < molecule.LstChain[index].LstAminoAcid.length; i++) {
                for (var j = 0; j < molecule.LstChain[index].LstAminoAcid[i].LstAtoms.length; j++) {
                    var at = molecule.LstChain[index].LstAminoAcid[i].LstAtoms[j];
                    //voy a checar cada uno para ver si está en wire o en solid
                    //alert(ColorTotal[at.BloqueSolid-1]);
                    //alert(at.NameAtom);
                    at.State = 'Inactive';
                    
                }

            }
        }

        //alert("entra ProcesarCadena:"+index);
    }
}


function CambiarRepresentacion(Repre) //Representacion es en lo que se va a cambiar
{
    if (Repre == 'Cpk') {
        for (var o in AtomosSeleccionados) //son los objetos seleccionados 
        {
            //primero encontrar con el átomo "o" la posición en el bloque y en el array, y hacerle un splice ahí
            //
            var ato = AtomosSeleccionados[o];


            var bloqueSIni = Math.ceil(ato.id / NoPaso) - 1; //bloque 0 va del atomo 1 al 20 
            var verPosBS = (ato.id - (bloqueSIni * NoPaso) - 1) * nVertices; //da la posicion exacta en el arreglo

            var vertexPosition = (ato.PositionBWire - 1) * nVertices; //867 es el número de vértices por cada esfera de latitudes y longitudes 16
            var colorPosition = (ato.PositionBWire - 1) * nColor;
            var indexPosition = (ato.PositionBWire - 1) * nIndices;

            //alert("AtomNum: "+ato.NumberAtom);
            if (ato.NameAtom == 'H') {
                //alert("H");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) //vertices para esfera de 16 latitudes y longitudes
                {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayH[z] + ato.X - Cx; //estoy quitando y al mismo tiempo agregando, por lo que se queda
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayH[z + 1] + ato.Y - Cy; //la misma longitud en cada operación
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayH[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayH[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayH[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayH[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'C') {
                //alert("C");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

                //alert("saleC"); 
            } else if (ato.NameAtom == 'PB') {
                //alert("PB");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'TI') {
                //alert("TI");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'CA') {
                //alert("CA");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'N') {
                //alert("N");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) //vertices para esfera de 16 latitudes y longitudes
                {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayN[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayN[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayN[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayN[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayN[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayN[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'O') {
                //alert("O");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) //vertices para esfera de 16 latitudes y longitudes
                {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayO[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayO[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayO[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayO[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayO[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayO[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

                //alert("ssss");  

            } else if (ato.NameAtom == 'S') {
                //alert("S");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) //vertices para esfera de 16 latitudes y longitudes
                {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayS[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayS[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayS[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayS[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayS[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayS[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'P') {
                //alert("P");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) //vertices para esfera de 16 latitudes y longitudes
                {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayP[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayP[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayP[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayP[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayP[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayP[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else /////////// DEFAULT
            {
                //alert("entra aqui");
                //ingresar los nuevos vértices
                for (var z = 0; z < 867;) //vertices para esfera de 16 latitudes y longitudes
                {
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArrayDefault[z] + ato.X - Cx;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArrayDefault[z + 1] + ato.Y - Cy;
                    wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArrayDefault[z + 2] + ato.Z - Cz;

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni][verPosBS + z] = verArrayDefault[z] + ato.X - Cx;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArrayDefault[z + 1] + ato.Y - Cy;
                    vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArrayDefault[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

                //alert("eyyyyyyyyyytra aqui");
            }
            ato.Representation = "CPK";

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[ato.BloqueWire - 1]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wirePositionData[ato.BloqueWire - 1]), gl.DYNAMIC_DRAW);
            sphereWirePositionBuffer[ato.BloqueWire - 1].itemSize = 3;
            sphereWirePositionBuffer[ato.BloqueWire - 1].numItems = (wirePositionData[ato.BloqueWire - 1].length / 3) * 1;

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloqueSIni]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataD[bloqueSIni]), gl.DYNAMIC_DRAW);
            sphereDifufusePositionBuffer[bloqueSIni].itemSize = 3;
            sphereDifufusePositionBuffer[bloqueSIni].numItems = (vertexPositionDataD[bloqueSIni].length / 3) * 1;

            //gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[bloques]);
            //gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(wirePositionData[bloques]));   

            //gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloques]);
            //gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(vertexPositionDataD[bloques]));   

        }
    } else if (Repre == 'SB') {
        //alert(88);
        for (var o in AtomosSeleccionados) //son los objetos seleccionados 
        {
            //primero encontrar con el átomo "o" la posición en el bloque y en el array, y hacerle un splice ahí
            //
            var ato = AtomosSeleccionados[o];

            var bloqueSIni = Math.ceil(ato.NumberAtom / NoPaso) - 1; //bloque 0 va del atomo 1 al 20 
            var verPosBS = (ato.NumberAtom - (bloqueSIni * NoPaso) - 1) * nVertices; //da la posicion exacta en el arreglo

            var vertexPosition = (ato.PositionBWire - 1) * nVertices; //867 es el número de vértices por cada esfera de latitudes y longitudes 16
            var colorPosition = (ato.PositionBWire - 1) * nColor;
            var indexPosition = (ato.PositionBWire - 1) * nIndices;

            for (var z = 0; z < 867;) //vertices para esfera de 16 latitudes y longitudes
            {
                wirePositionData[ato.BloqueWire - 1][vertexPosition + z] = verArray[z] + ato.X - Cx;
                wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 1] = verArray[z + 1] + ato.Y - Cy;
                wirePositionData[ato.BloqueWire - 1][vertexPosition + z + 2] = verArray[z + 2] + ato.Z - Cz;

                /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                vertexPositionDataD[bloqueSIni][verPosBS + z] = verArray[z] + ato.X - Cx;
                vertexPositionDataD[bloqueSIni][verPosBS + z + 1] = verArray[z + 1] + ato.Y - Cy;
                vertexPositionDataD[bloqueSIni][verPosBS + z + 2] = verArray[z + 2] + ato.Z - Cz;

                z = z + 3;
            }



            ato.Representation = "SB";

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[ato.BloqueWire - 1]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wirePositionData[ato.BloqueWire - 1]), gl.DYNAMIC_DRAW);
            sphereWirePositionBuffer[ato.BloqueWire - 1].itemSize = 3;
            sphereWirePositionBuffer[ato.BloqueWire - 1].numItems = (wirePositionData[ato.BloqueWire - 1].length / 3) * 1;

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloqueSIni]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataD[bloqueSIni]), gl.DYNAMIC_DRAW);
            sphereDifufusePositionBuffer[bloqueSIni].itemSize = 3;
            sphereDifufusePositionBuffer[bloqueSIni].numItems = (vertexPositionDataD[bloqueSIni].length / 3) * 1;
        }

    } else if (Repre == 'B') {



    } else {

    }
}