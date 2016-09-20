function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;

       
        var rect = event.target.getBoundingClientRect();
        if (rect.left <= lastMouseX && lastMouseX < rect.right && rect.top <= lastMouseY && lastMouseY < rect.bottom) 
        {
            //Tengo q llamar al drawscene 2 veces
            /*
            var renderbuffer = gl.createRenderbuffer();
            gl.bindBuffer(gl.RENDERBUFFER, renderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,  gl.viewportWidth,gl.viewportHeight);

            var framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);*/

            var u_Clicked = gl.getUniformLocation(program, 'uOffscreen');

            gl.uniform1i(u_Clicked, 1);
            drawScene(1);

            var pixels = new Uint8Array(4);
            var pixelsUp = new Uint8Array(4); 
            var pixelsDown = new Uint8Array(4); 
            var pixelsLeft = new Uint8Array(4); 
            var pixelsRight = new Uint8Array(4); 

            gl.readPixels(lastMouseX-rect.left,rect.bottom-lastMouseY,1,1,gl.RGBA,gl.UNSIGNED_BYTE, pixels);


            if (pixels[0]>0 || pixels[1]>0 || pixels[2]>0) 
            {
                gl.readPixels(lastMouseX-rect.left,rect.bottom-lastMouseY+2,1,1,gl.RGBA,gl.UNSIGNED_BYTE, pixelsUp);
                gl.readPixels(lastMouseX-rect.left,rect.bottom-lastMouseY-2,1,1,gl.RGBA,gl.UNSIGNED_BYTE, pixelsDown);
                gl.readPixels(lastMouseX-rect.left-2,rect.bottom-lastMouseY,1,1,gl.RGBA,gl.UNSIGNED_BYTE, pixelsLeft);
                gl.readPixels(lastMouseX-rect.left+2,rect.bottom-lastMouseY,1,1,gl.RGBA,gl.UNSIGNED_BYTE, pixelsRight);

                if ( (pixelsUp[0]==pixelsDown[0] && pixelsUp[1]==pixelsDown[1] && pixelsUp[2]==pixelsDown[2]) || (pixelsLeft[0]==pixelsRight[0] && pixelsLeft[1]==pixelsRight[1] && pixelsLeft[2]==pixelsRight[2]) ) 
                {

                    var number=GetNumAtom(pixels);
                    var atom=molecule.LstAtoms[number-1];//se le resta uno ya que los arreglos de javascript comienzan en 0 y los
                                                         //índices de los átomos comienzan en 1

                    ////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////////////////// TECLA CTRL PRESIONADA //////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////
                    if (event.ctrlKey) 
                    {
                        //////////////////// EL ATOMO SELECCIONADO YA ESTABA SELECCIONADO ///////////////////////
                        if (atom.Seleccionado==true) 
                        {
                            //alert(atom.BloqueWire);
                            //alert("EL ATOMO SELECCIONADO YA ESTABA SELECCIONADO");
                            atom.Seleccionado=false;
                            //////////--------------el atomo seleccionado es el último en los Bloques Wire-----------------//////////
                            if (atom.BloqueWire==NBW  &&  atom.PositionBWire==LstBW[NBW-1].length ) //mandar la alerta para checar si esto está bien
                            { //las posiciones van desde 0, 
                                //quitar el atom wire
                                //alert(2);
                                //alert(wireColorTotal[NBW-1].length);
                                wirePositionData[NBW-1].splice( (atom.PositionBWire-1)*nVertices,nVertices);
                                wirenormalDataN[NBW-1].splice( (atom.PositionBWire-1)*nVertices,nVertices);
                                wireColorTotal[NBW-1].splice( (atom.PositionBWire-1)*nColor,nColor);
                                wireindexData[NBW-1].splice( (atom.PositionBWire-1)*nIndices,nIndices);
                                //alert(wireColorTotal[NBW-1].length);
                               
                                LstBW[NBW-1].pop() //se quita el atom del wire
                                //alert(LstBW[NBW-1].length);
                                if (LstBW[NBW-1].length==0) 
                                {
                                    NBW-=1;
                                    if (NBW==0) 
                                    {
                                        haySeleccionado=false;
                                        //no tengo que imprimirlo el wire en los buffersWire porque no los voy a ingresar en la tarjeta grafica
                                    }
                                }
                                if (haySeleccionado) 
                                {
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[NBW-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirePositionData[NBW-1]), gl.DYNAMIC_DRAW);
                                    sphereWirePositionBuffer[NBW-1].itemSize = 3;
                                    sphereWirePositionBuffer[NBW-1].numItems = (wirePositionData[NBW-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER,sphereWireColorBuffer[NBW-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wireColorTotal[NBW-1]), gl.DYNAMIC_DRAW);
                                    sphereWireColorBuffer[NBW-1].itemSize = 4;
                                    sphereWireColorBuffer[NBW-1].numItems = (wireColorTotal[NBW-1].length / 4) * 1;

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereWireIndexBuffer[NBW-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(wireindexData[NBW-1]), gl.DYNAMIC_DRAW);
                                    sphereWireIndexBuffer[NBW-1].itemSize = 1;
                                    sphereWireIndexBuffer[NBW-1].numItems = (wireindexData[NBW-1].length / 1) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireNormalBuffer[NBW-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirenormalDataN[NBW-1]), gl.DYNAMIC_DRAW);
                                    sphereWireNormalBuffer[NBW-1].itemSize = 3;
                                    sphereWireNormalBuffer[NBW-1].numItems = (wirenormalDataN[NBW-1].length / 3) * 1; 
                                }

                               
                                
                            }
                            //////////--------------el atomo seleccionado no es el último en los Bloques Wire-----------------//////////
                            else
                            {
                                //alert("no es último Wire atom");
                                //voy a eliminar este atom y además voy a agregar el que está en la cola del wire a esta posición
                                LstBW[NBW-1][ LstBW[NBW-1].length-1 ].BloqueWire=atom.BloqueWire;
                                LstBW[NBW-1][ LstBW[NBW-1].length-1 ].PositionBWire=atom.PositionBWire;
                                LstBW[atom.BloqueWire-1].splice(  atom.PositionBWire-1, 1  ,  LstBW[NBW-1][ LstBW[NBW-1].length-1 ] )   

                                for(var i=0; i<nVertices;i++)
                                {
                                    wirePositionData[atom.BloqueWire-1].splice( ((atom.PositionBWire-1)*nVertices) + i, 1, wirePositionData[NBW-1][wirePositionData[NBW-1].length - nVertices + i] );
                                    wirenormalDataN[atom.BloqueWire-1].splice( ((atom.PositionBWire-1)*nVertices) + i,  1, wirenormalDataN[NBW-1][wirenormalDataN[NBW-1].length - nVertices + i] );                                    
                                }
                                //alert(4);
                                for(var i=0; i<nColor;i++)
                                {
                                    wireColorTotal[atom.BloqueWire-1].splice( ((atom.PositionBWire-1)*nColor) + i,      1, wireColorTotal[NBW-1][wireColorTotal[NBW-1].length - nColor + i] );
                                }
                                //alert(5);
                                //lo índices sólo quito los indices últimos del último bloque
                                wireindexData[NBW-1].splice(  wireindexData[NBW-1].length - nIndices,nIndices);
                                //alert(6);

                                //ahora eliminar el que tenía en la cola
                                wirePositionData[NBW-1].splice(wirePositionData[NBW-1].length - nVertices,nVertices);
                                wirenormalDataN[NBW-1].splice(wirenormalDataN[NBW-1].length - nVertices,nVertices);
                                wireColorTotal[NBW-1].splice(wireColorTotal[NBW-1].length - nColor,nColor);
                                //alert(7);


                                LstBW[NBW-1].pop() //se quita el atom del wire
                                if (LstBW[NBW-1].length==0) 
                                {
                                    NBW-=1;
                                }
                                else
                                {
                                    if (atom.BloqueWire!=NBS) 
                                    {
                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[atom.BloqueWire-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirePositionData[atom.BloqueWire-1]), gl.DYNAMIC_DRAW);
                                        sphereWirePositionBuffer[atom.BloqueWire-1].itemSize = 3;
                                        sphereWirePositionBuffer[atom.BloqueWire-1].numItems = (wirePositionData[atom.BloqueWire-1].length / 3) * 1;

                                        gl.bindBuffer(gl.ARRAY_BUFFER,sphereWireColorBuffer[atom.BloqueWire-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wireColorTotal[atom.BloqueWire-1]), gl.DYNAMIC_DRAW);
                                        sphereWireColorBuffer[atom.BloqueWire-1].itemSize = 4;
                                        sphereWireColorBuffer[atom.BloqueWire-1].numItems = (wireColorTotal[atom.BloqueWire-1].length / 4) * 1;

                                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereWireIndexBuffer[atom.BloqueWire-1]);
                                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(wireindexData[atom.BloqueWire-1]), gl.DYNAMIC_DRAW);
                                        sphereWireIndexBuffer[atom.BloqueWire-1].itemSize = 1;
                                        sphereWireIndexBuffer[atom.BloqueWire-1].numItems = (wireindexData[atom.BloqueWire-1].length / 1) * 1;

                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireNormalBuffer[atom.BloqueWire-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirenormalDataN[atom.BloqueWire-1]), gl.DYNAMIC_DRAW);
                                        sphereWireNormalBuffer[atom.BloqueWire-1].itemSize = 3;
                                        sphereWireNormalBuffer[atom.BloqueWire-1].numItems = (wirenormalDataN[atom.BloqueWire-1].length / 3) * 1; 
                                        //alert("entra al diferencia de bloques");
                                    }

                                }
                                //alert(6);
                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[NBW-1]);
                                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirePositionData[NBW-1]), gl.DYNAMIC_DRAW);
                                sphereWirePositionBuffer[NBW-1].itemSize = 3;
                                sphereWirePositionBuffer[NBW-1].numItems = (wirePositionData[NBW-1].length / 3) * 1;

                                gl.bindBuffer(gl.ARRAY_BUFFER,sphereWireColorBuffer[NBW-1]);
                                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wireColorTotal[NBW-1]), gl.DYNAMIC_DRAW);
                                sphereWireColorBuffer[NBW-1].itemSize = 4;
                                sphereWireColorBuffer[NBW-1].numItems = (wireColorTotal[NBW-1].length / 4) * 1;

                                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereWireIndexBuffer[NBW-1]);
                                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(wireindexData[NBW-1]), gl.DYNAMIC_DRAW);
                                sphereWireIndexBuffer[NBW-1].itemSize = 1;
                                sphereWireIndexBuffer[NBW-1].numItems = (wireindexData[NBW-1].length / 1) * 1;

                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireNormalBuffer[NBW-1]);
                                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirenormalDataN[NBW-1]), gl.DYNAMIC_DRAW);
                                sphereWireNormalBuffer[NBW-1].itemSize = 3;
                                sphereWireNormalBuffer[NBW-1].numItems = (wirenormalDataN[NBW-1].length / 3) * 1; 
                                //alert(79);

                            }

                            //---------------agregarlo a la cola en el solid ////////////////////////////////////////////////////////////////////////7
                            if (LstBS[NBS-1].length==NoPaso ) 
                            {
                                NBS+=1;                                
                            }
                            //alert(88);
                            LstBS[NBS-1].push(atom);
                            atom.BloqueSolid=NBS;
                            atom.PositionBSolid=LstBS[NBS-1].length;
                            for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                            {        
                                vertexPositionData[NBS-1].push(verArray[z]     + atom.X -Cx);
                                vertexPositionData[NBS-1].push(verArray[z+1]   + atom.Y -Cy);
                                vertexPositionData[NBS-1].push(verArray[z+2]   + atom.Z -Cz);

                                normalDataN[NBS-1].push(normalData[z]    );
                                normalDataN[NBS-1].push(normalData[z+1]   );
                                normalDataN[NBS-1].push(normalData[z+2]   );

                                z=z+3;
                            }
                            //alert(8899);
                            for(var i=0; i<nColor;)
                            {
                                ColorTotal[NBS-1].push(atom.ColorRGB[0]);
                                ColorTotal[NBS-1].push(atom.ColorRGB[1]);
                                ColorTotal[NBS-1].push(atom.ColorRGB[2]);
                                ColorTotal[NBS-1].push(atom.ColorRGB[3]);
                                i=i+4;
                            }
                            for(var i=0; i<nIndices;i++)
                            {
                                //tengo que saber en qué posicion se encuentra
                                indexData[NBS-1].push(indicesSphere[i]  +   ( 289 * (LstBS[NBS-1].length-1)) );
                            }
                            //alert(88777);
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                            sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                            sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                            sphereVertexColorBuffer[NBS-1].itemSize = 4;
                            sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);

                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                            sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                            sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[NBS-1]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[NBS-1]), gl.DYNAMIC_DRAW);
                            sphereVertexNormalBuffer[NBS-1].itemSize = 3;
                            sphereVertexNormalBuffer[NBS-1].numItems = normalDataN[NBS-1].length/3;




                        }

                        /////////////////////////////////////////////////////////////////////////////////////////
                        //////////////////// EL ATOMO SELECCIONADO NO ESTABA SELECCIONADO ///////////////////////
                        else
                        {
                            //alert("EL ATOMO SELECCIONADO NO ESTABA SELECCIONADO");
                            atom.Seleccionado=true;
                            haySeleccionado=true;

                            if (NBW==0)  //es el primero que voy a agregar al objeto Solid
                            {
                                NBW=1;
                                LstBW[0]=new Array();
                            }
                            else
                            {
                                //---------------agregarlo a la cola en el wire
                                if (LstBW[NBW-1].length==NoPaso ) 
                                {
                                    NBW+=1;   
                                    LstBW[NBW-1]=new Array(); 
                                    wirePositionData[NBW-1]=new Array();
                                    wirenormalDataN[NBW-1]=new Array();
                                    wireColorTotal[NBW-1]=new Array();
                                    wireindexData[NBW-1]=new Array();

                                    sphereWirePositionBuffer[NBW-1]=new Array();
                                    sphereWireColorBuffer[NBW-1]=new Array();
                                    sphereWireIndexBuffer[NBW-1]=new Array();
                                    sphereWireNormalBuffer[NBW-1]=new Array();
                                }

                            }
                            LstBW[NBW-1].push(atom);                            
                            atom.BloqueWire=NBW;                            
                            atom.PositionBWire=LstBW[NBW-1].length;
                            //alert(NBW);
                            for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                            {     
                                wirePositionData[NBW-1].push(verArray[z]     + atom.X -Cx);
                                wirePositionData[NBW-1].push(verArray[z+1]   + atom.Y -Cy);
                                wirePositionData[NBW-1].push(verArray[z+2]   + atom.Z -Cz);

                                wirenormalDataN[NBW-1].push(verArray[z]    );
                                wirenormalDataN[NBW-1].push(verArray[z+1]  );
                                wirenormalDataN[NBW-1].push(verArray[z+2]  );

                                z=z+3;
                            }   
                            //alert(99);                         
                            for(var i=0; i<nColor;)
                            {
                                wireColorTotal[NBW-1].push(atom.ColorRGB[0]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[1]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[2]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[3]);
                                i=i+4;
                            }
                            //alert(nIndices);
                            for(var i=0; i<nIndices;i++)
                            {
                                //tengo que saber en qué posicion se encuentra
                                wireindexData[NBW-1].push(indicesSphere[i]  +   ( 289 * (LstBW[NBW-1].length-1)) );
                            }
                            //alert(44);                            
                            sphereWirePositionBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirePositionData[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWirePositionBuffer[NBW-1].itemSize = 3;
                            sphereWirePositionBuffer[NBW-1].numItems = (wirePositionData[NBW-1].length / 3) * 1;
                            //alert(54);
                            sphereWireColorBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER,sphereWireColorBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wireColorTotal[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireColorBuffer[NBW-1].itemSize = 4;
                            sphereWireColorBuffer[NBW-1].numItems = (wireColorTotal[NBW-1].length / 4) * 1;
                            //alert(64);
                            sphereWireIndexBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereWireIndexBuffer[NBW-1]);
                            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(wireindexData[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireIndexBuffer[NBW-1].itemSize = 1;
                            sphereWireIndexBuffer[NBW-1].numItems = (wireindexData[NBW-1].length / 1) * 1;
                            
                            sphereWireNormalBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireNormalBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirenormalDataN[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireNormalBuffer[NBW-1].itemSize = 3;
                            sphereWireNormalBuffer[NBW-1].numItems = (wirenormalDataN[NBW-1].length / 3) * 1;  

                            
                            ///////////////////---------------Quitar el átomo del ObjetoSolid ///////////////////////////////////////////////////////

                            //////////--------------el atomo seleccionado es el último del objeto Solido-----------------//////////
                            if (atom.BloqueSolid==NBS  &&  atom.PositionBSolid==LstBS[NBS-1].length ) //mandar la alerta para checar si esto está bien
                            { //las posiciones van desde 0, 
                                //quitar el atom solid
                                //alert("el atomo seleccionado es el ultimo del objeto solido");
                                vertexPositionData[NBS-1].splice( (atom.PositionBSolid-1)*nVertices,nVertices);
                                normalDataN[NBS-1].splice( (atom.PositionBSolid-1)*nVertices,nVertices);
                                ColorTotal[NBS-1].splice( (atom.PositionBSolid-1)*nColor,nColor);
                                indexData[NBS-1].splice((atom.PositionBSolid-1)*nIndices,nIndices);


                                LstBS[NBS-1].pop() //se quita el atom del solid
                                if (LstBS[NBS-1].length==0) //quiere decir que era el único átomo que había en todo el bloque solid
                                {
                                    NBS-=1;
                                }
                                else
                                {
                                    //solo se imprime si no se eliminó un bloque, ya que si se eliminó un bloque no se va a imprimir en la tarjeta gráfica
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                    sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                    sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;
                                }

                            }
                            //////////--------------el atomo seleccionado no es el último el los bloques Solid-----------------//////////
                            else
                            {   
                                //alert("el atomo seleccionado no es el ultimo del objeto solido");                                                          
                                //voy a eliminar este atom y además voy a agregar el que está en la cola del solid a esta posición
                                for(var i=0; i<nVertices;i++)
                                {
                                    vertexPositionData[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nVertices)+i, 1, vertexPositionData[NBS-1][vertexPositionData[NBS-1].length - nVertices + i ] );
                                    normalDataN[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nVertices)+i,        1, normalDataN[NBS-1][normalDataN[NBS-1].length - nVertices + i ] );     
                                }                                
                                for(var i=0; i<nColor;i++)
                                {
                                    ColorTotal[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nColor)+i,            1, ColorTotal[NBS-1][ColorTotal[NBS-1].length - nColor + i ] );  
                                }

                                                              
                                //los índices sólo quito los indices últimos del último bloque
                                indexData[NBS-1].splice( indexData[NBS-1].length - nIndices ,nIndices);

                                //ahora eliminar el que tenía en la cola
                                vertexPositionData[NBS-1].splice(vertexPositionData[NBS-1].length - nVertices,nVertices);
                                normalDataN[NBS-1].splice(normalDataN[NBS-1].length - nVertices,nVertices);
                                ColorTotal[NBS-1].splice(ColorTotal[NBS-1].length - nColor,nColor);

                                LstBS[NBS-1][ LstBS[NBS-1].length-1 ].BloqueSolid=atom.BloqueSolid;
                                LstBS[NBS-1][ LstBS[NBS-1].length-1 ].PositionBSolid=atom.PositionBSolid;
                                LstBS[atom.BloqueSolid-1].splice( atom.PositionBSolid-1, 1, LstBS[NBS-1][LstBS[NBS-1].length-1] ) //se quita el atom del solid y se agrega el de la cola
                                LstBS[NBS-1].pop();
                                //alert(98888);
                                
                                if (atom.BloqueSolid==NBS) 
                                {
                                    //alert("wss");
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                    sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                    sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                }
                                else
                                {
                                    //alert("yyyyy");
                                    //quiere decir que son dos bloques los que voy a procesar
                                    if (LstBS[NBS-1].length==0) 
                                    {
                                        //alert(88);
                                    }
                                    else
                                    {
                                        //alert(99);
                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                        sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexColorBuffer[NBS-1].itemSize = 4;
                                        sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                        gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                        sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexNormalBuffer[NBS-1].itemSize = 3;
                                        sphereVertexNormalBuffer[NBS-1].numItems = normalDataN[NBS-1].length/3;
                                        //alert(100);

                                    }
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[atom.BloqueSolid-1].itemSize = 3;
                                    sphereVertexPositionBuffer[atom.BloqueSolid-1].numItems = (vertexPositionData[atom.BloqueSolid-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[atom.BloqueSolid-1].itemSize = 4;
                                    sphereVertexColorBuffer[atom.BloqueSolid-1].numItems = ColorTotal[atom.BloqueSolid-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[atom.BloqueSolid-1].itemSize = 1;
                                    sphereVertexIndexBuffer[atom.BloqueSolid-1].numItems = indexData[atom.BloqueSolid-1].length;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexNormalBuffer[atom.BloqueSolid-1].itemSize = 3;
                                    sphereVertexNormalBuffer[atom.BloqueSolid-1].numItems = normalDataN[atom.BloqueSolid-1].length/3;
                                    //alert(101);
                                }

                                if (LstBS[NBS-1].length==0) 
                                {
                                    NBS-=1;
                                }                                

                            }                            
                        }

                    }
                    //////////////////////////////////////////////////////////////////////////////////////////
                    //////////////////////////////// SIN PRESIONAR LA TECLA CTRL//////////////////////////////
                    //////////////////////////////////////////////////////////////////////////////////////////
                    else
                    {
                       //////////////////// EL ATOMO SELECCIONADO YA ESTABA SELECCIONADO ///////////////////////
                       //------- poner todos en solid
                        if (atom.Seleccionado==true) 
                        {
                            haySeleccionado=false;
                            //alert(NBW);

                            for(var i=0;i<NBW;i++) //para todos los bloques wire
                            {                               
                                //todos los átomos de cada bloque mandarlo a la cola del objeto solid y mandar a null los bloques
                                for(var j=0;j<LstBW[i].length;j++)
                                {
                                    var atomTemp = LstBW[i][j];
                                    atomTemp.Seleccionado=false;
                                    //alert(LstBW[i].length);

                                    if (LstBS[NBS-1].length==NoPaso ) 
                                    {
                                        alert("es igual");
                                        if (j>0) //tengo que imprimir el bloque
                                        {
                                            alert("entra");
                                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                            sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                            sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                            sphereVertexColorBuffer[NBS-1].itemSize = 4;
                                            sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                            gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                            sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                            sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[NBS-1]);
                                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[NBS-1]), gl.DYNAMIC_DRAW);
                                            sphereVertexNormalBuffer[NBS-1].itemSize = 3;
                                            sphereVertexNormalBuffer[NBS-1].numItems = normalDataN[NBS-1].length/3;

                                        }
                                        NBS+=1;                                
                                    }

                                    //voy a agregar los atomos con push a las LstBS
                                    LstBS[NBS-1].push(atomTemp);
                                    atomTemp.BloqueSolid=NBS;
                                    atomTemp.PositionBSolid= LstBS[NBS-1].length;
                                    //alert("Vertex:"+vertexPositionData[NBS-1].length);
                                    var temp=[];
                                    for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                                    {        
                                        vertexPositionData[NBS-1].push(verArray[z]     + atomTemp.X -Cx);
                                        vertexPositionData[NBS-1].push(verArray[z+1]   + atomTemp.Y -Cy);
                                        vertexPositionData[NBS-1].push(verArray[z+2]   + atomTemp.Z -Cz);

                                        normalDataN[NBS-1].push(normalData[z]    );
                                        normalDataN[NBS-1].push(normalData[z+1]   );
                                        normalDataN[NBS-1].push(normalData[z+2]   );

                                        z=z+3;
                                    }
                                    //alert("Vertex:"+ vertexPositionData[NBS-1].length);
                                    //alert(ColorTotal[NBS-1].length);
                                    for(var z=0; z<nColor;)
                                    {
                                        ColorTotal[NBS-1].push(atomTemp.ColorRGB[0]);
                                        ColorTotal[NBS-1].push(atomTemp.ColorRGB[1]);
                                        ColorTotal[NBS-1].push(atomTemp.ColorRGB[2]);
                                        ColorTotal[NBS-1].push(atomTemp.ColorRGB[3]);
                                        z=z+4;
                                    }
                                    //alert(indexData[NBS-1]);                                    
                                    for(var z=0; z<nIndices;z++)
                                    {
                                        //tengo que saber en qué posicion se encuentra
                                        indexData[NBS-1].push(indicesSphere[z]  +   ( 289 * (LstBS[NBS-1].length-1)) );
                                    }
                                    //alert(temp);
                                    //alert(LstBS[NBS-1].length-1);
                                    //alert(indexData[NBS-1][indexData[NBS-1].length-1]);

                                    
                                }

                                LstBW[i]=[];

                                //alert("pasa");
                                wirePositionData[i]=new Array();
                                wirenormalDataN[i]=new Array();
                                wireColorTotal[i]=new Array();
                                wireindexData[i]=new Array();

                                sphereWirePositionBuffer[i]=new Array();
                                sphereWireColorBuffer[i]=new Array();
                                sphereWireIndexBuffer[i]=new Array();
                                sphereWireNormalBuffer[i]=new Array();

                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                sphereVertexColorBuffer[NBS-1].itemSize = 4;
                                sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[NBS-1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[NBS-1]), gl.DYNAMIC_DRAW);
                                sphereVertexNormalBuffer[NBS-1].itemSize = 3;
                                sphereVertexNormalBuffer[NBS-1].numItems = normalDataN[NBS-1].length/3;
                                //alert("pasa2");

                            }

                            NBW=0;

                        }



                        //////////////////// EL ATOMO SELECCIONADO NO ESTABA SELECCIONADO ///////////////////////
                        //------ poner todos en solid menos este
                        else
                        {

                            for(var i=0;i<NBW;i++) //para todos los bloques wire
                            {                               
                                //todos los átomos de cada bloque mandarlo a la cola del objeto solid y mandar a null los bloques
                                for(var j=0;j<LstBW[i].length;j++)
                                {
                                    var atomTemp = LstBW[i][j];
                                    atomTemp.Seleccionado=false;
                                    //alert(LstBW[i].length);

                                    if (LstBS[NBS-1].length==NoPaso ) 
                                    {
                                        //alert("es igual");
                                        if (j>0) //tengo que imprimir el bloque
                                        {
                                            //alert("entra");
                                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                            sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                            sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                            sphereVertexColorBuffer[NBS-1].itemSize = 4;
                                            sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                            gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                            sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                            sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[NBS-1]);
                                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[NBS-1]), gl.DYNAMIC_DRAW);
                                            sphereVertexNormalBuffer[NBS-1].itemSize = 3;
                                            sphereVertexNormalBuffer[NBS-1].numItems = normalDataN[NBS-1].length/3;

                                        }
                                        NBS+=1;                                
                                    }

                                    //voy a agregar los atomos con push a las LstBS
                                    LstBS[NBS-1].push(atomTemp);
                                    atomTemp.BloqueSolid=NBS;
                                    atomTemp.PositionBSolid= LstBS[NBS-1].length;
                                    //alert("Vertex:"+vertexPositionData[NBS-1].length);
                                    var temp=[];
                                    for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                                    {        
                                        vertexPositionData[NBS-1].push(verArray[z]     + atomTemp.X -Cx);
                                        vertexPositionData[NBS-1].push(verArray[z+1]   + atomTemp.Y -Cy);
                                        vertexPositionData[NBS-1].push(verArray[z+2]   + atomTemp.Z -Cz);

                                        normalDataN[NBS-1].push(normalData[z]    );
                                        normalDataN[NBS-1].push(normalData[z+1]   );
                                        normalDataN[NBS-1].push(normalData[z+2]   );

                                        z=z+3;
                                    }
                                    //alert("Vertex:"+ vertexPositionData[NBS-1].length);
                                    //alert(ColorTotal[NBS-1].length);
                                    for(var z=0; z<nColor;)
                                    {
                                        ColorTotal[NBS-1].push(atomTemp.ColorRGB[0]);
                                        ColorTotal[NBS-1].push(atomTemp.ColorRGB[1]);
                                        ColorTotal[NBS-1].push(atomTemp.ColorRGB[2]);
                                        ColorTotal[NBS-1].push(atomTemp.ColorRGB[3]);
                                        z=z+4;
                                    }
                                    //alert(indexData[NBS-1]);                                    
                                    for(var z=0; z<nIndices;z++)
                                    {
                                        //tengo que saber en qué posicion se encuentra
                                        indexData[NBS-1].push(indicesSphere[z]  +   ( 289 * (LstBS[NBS-1].length-1)) );
                                    }
                                    //alert(temp);
                                    //alert(LstBS[NBS-1].length-1);
                                    //alert(indexData[NBS-1][indexData[NBS-1].length-1]);

                                    
                                }

                                LstBW[i]=[];

                                //alert("pasa");
                                wirePositionData[i]=new Array();
                                wirenormalDataN[i]=new Array();
                                wireColorTotal[i]=new Array();
                                wireindexData[i]=new Array();

                                sphereWirePositionBuffer[i]=new Array();
                                sphereWireColorBuffer[i]=new Array();
                                sphereWireIndexBuffer[i]=new Array();
                                sphereWireNormalBuffer[i]=new Array();

                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                sphereVertexColorBuffer[NBS-1].itemSize = 4;
                                sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[NBS-1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[NBS-1]), gl.DYNAMIC_DRAW);
                                sphereVertexNormalBuffer[NBS-1].itemSize = 3;
                                sphereVertexNormalBuffer[NBS-1].numItems = normalDataN[NBS-1].length/3;
                                //alert("pasa2");

                            }

                            NBW=0;


                            //luego poner este en wireFrame
                            atom.Seleccionado=true;
                            haySeleccionado=true;

                            NBW=1;
                            LstBW[0]=new Array();
                                           
                            LstBW[NBW-1].push(atom);                            
                            atom.BloqueWire=1;                            
                            atom.PositionBWire=1;
                            //alert(NBW);
                            for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                            {     
                                wirePositionData[NBW-1].push(verArray[z]     + atom.X -Cx);
                                wirePositionData[NBW-1].push(verArray[z+1]   + atom.Y -Cy);
                                wirePositionData[NBW-1].push(verArray[z+2]   + atom.Z -Cz);

                                wirenormalDataN[NBW-1].push(verArray[z]    );
                                wirenormalDataN[NBW-1].push(verArray[z+1]  );
                                wirenormalDataN[NBW-1].push(verArray[z+2]  );

                                z=z+3;
                            }   
                            //alert(99);                         
                            for(var i=0; i<nColor;)
                            {
                                wireColorTotal[NBW-1].push(atom.ColorRGB[0]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[1]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[2]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[3]);
                                i=i+4;
                            }
                            //alert(nIndices);
                            for(var i=0; i<nIndices;i++)
                            {
                                //tengo que saber en qué posicion se encuentra
                                wireindexData[NBW-1].push(indicesSphere[i]  +   ( 289 * (LstBW[NBW-1].length-1)) );
                            }
                            //alert(44);                            
                            sphereWirePositionBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirePositionData[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWirePositionBuffer[NBW-1].itemSize = 3;
                            sphereWirePositionBuffer[NBW-1].numItems = (wirePositionData[NBW-1].length / 3) * 1;
                            //alert(54);
                            sphereWireColorBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER,sphereWireColorBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wireColorTotal[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireColorBuffer[NBW-1].itemSize = 4;
                            sphereWireColorBuffer[NBW-1].numItems = (wireColorTotal[NBW-1].length / 4) * 1;
                            //alert(64);
                            sphereWireIndexBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereWireIndexBuffer[NBW-1]);
                            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(wireindexData[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireIndexBuffer[NBW-1].itemSize = 1;
                            sphereWireIndexBuffer[NBW-1].numItems = (wireindexData[NBW-1].length / 1) * 1;
                            
                            sphereWireNormalBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireNormalBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirenormalDataN[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireNormalBuffer[NBW-1].itemSize = 3;
                            sphereWireNormalBuffer[NBW-1].numItems = (wirenormalDataN[NBW-1].length / 3) * 1;  

                            
                            ///////////////////---------------Quitar el átomo del ObjetoSolid ///////////////////////////////////////////////////////

                            //////////--------------el atomo seleccionado es el último del objeto Solido-----------------//////////
                            if (atom.BloqueSolid==NBS  &&  atom.PositionBSolid==LstBS[NBS-1].length ) //mandar la alerta para checar si esto está bien
                            { //las posiciones van desde 0, 
                                //quitar el atom solid
                                //alert("el atomo seleccionado es el ultimo del objeto solido");
                                vertexPositionData[NBS-1].splice( (atom.PositionBSolid-1)*nVertices,nVertices);
                                normalDataN[NBS-1].splice( (atom.PositionBSolid-1)*nVertices,nVertices);
                                ColorTotal[NBS-1].splice( (atom.PositionBSolid-1)*nColor,nColor);
                                indexData[NBS-1].splice((atom.PositionBSolid-1)*nIndices,nIndices);


                                LstBS[NBS-1].pop() //se quita el atom del solid
                                if (LstBS[NBS-1].length==0) //quiere decir que era el único átomo que había en todo el bloque solid
                                {
                                    NBS-=1;
                                }
                                else
                                {
                                    //solo se imprime si no se eliminó un bloque, ya que si se eliminó un bloque no se va a imprimir en la tarjeta gráfica
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                    sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                    sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;
                                }

                            }
                            //////////--------------el atomo seleccionado no es el último el los bloques Solid-----------------//////////
                            else
                            {   
                                //alert("el atomo seleccionado no es el ultimo del objeto solido");                                                          
                                //voy a eliminar este atom y además voy a agregar el que está en la cola del solid a esta posición
                                for(var i=0; i<nVertices;i++)
                                {
                                    vertexPositionData[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nVertices)+i, 1, vertexPositionData[NBS-1][vertexPositionData[NBS-1].length - nVertices + i ] );
                                    normalDataN[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nVertices)+i,        1, normalDataN[NBS-1][normalDataN[NBS-1].length - nVertices + i ] );     
                                }                                
                                for(var i=0; i<nColor;i++)
                                {
                                    ColorTotal[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nColor)+i,            1, ColorTotal[NBS-1][ColorTotal[NBS-1].length - nColor + i ] );  
                                }

                                                              
                                //los índices sólo quito los indices últimos del último bloque
                                indexData[NBS-1].splice( indexData[NBS-1].length - nIndices ,nIndices);

                                //ahora eliminar el que tenía en la cola
                                vertexPositionData[NBS-1].splice(vertexPositionData[NBS-1].length - nVertices,nVertices);
                                normalDataN[NBS-1].splice(normalDataN[NBS-1].length - nVertices,nVertices);
                                ColorTotal[NBS-1].splice(ColorTotal[NBS-1].length - nColor,nColor);

                                LstBS[NBS-1][ LstBS[NBS-1].length-1 ].BloqueSolid=atom.BloqueSolid;
                                LstBS[NBS-1][ LstBS[NBS-1].length-1 ].PositionBSolid=atom.PositionBSolid;
                                LstBS[atom.BloqueSolid-1].splice( atom.PositionBSolid-1, 1, LstBS[NBS-1][LstBS[NBS-1].length-1] ) //se quita el atom del solid y se agrega el de la cola
                                LstBS[NBS-1].pop();
                                //alert(98888);
                                
                                if (atom.BloqueSolid==NBS) 
                                {
                                    //alert("wss");
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                    sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                    sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                }
                                else
                                {
                                    //alert("yyyyy");
                                    //quiere decir que son dos bloques los que voy a procesar
                                    if (LstBS[NBS-1].length==0) 
                                    {
                                        //alert(88);
                                    }
                                    else
                                    {
                                        //alert(99);
                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                        sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexColorBuffer[NBS-1].itemSize = 4;
                                        sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                        gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                        sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexNormalBuffer[NBS-1].itemSize = 3;
                                        sphereVertexNormalBuffer[NBS-1].numItems = normalDataN[NBS-1].length/3;
                                        //alert(100);

                                    }
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[atom.BloqueSolid-1].itemSize = 3;
                                    sphereVertexPositionBuffer[atom.BloqueSolid-1].numItems = (vertexPositionData[atom.BloqueSolid-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[atom.BloqueSolid-1].itemSize = 4;
                                    sphereVertexColorBuffer[atom.BloqueSolid-1].numItems = ColorTotal[atom.BloqueSolid-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[atom.BloqueSolid-1].itemSize = 1;
                                    sphereVertexIndexBuffer[atom.BloqueSolid-1].numItems = indexData[atom.BloqueSolid-1].length;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexNormalBuffer[atom.BloqueSolid-1].itemSize = 3;
                                    sphereVertexNormalBuffer[atom.BloqueSolid-1].numItems = normalDataN[atom.BloqueSolid-1].length/3;
                                    //alert(101);
                                }

                                if (LstBS[NBS-1].length==0) 
                                {
                                    NBS-=1;
                                }                                

                            }   












                        }


                    }
                    


                    document.getElementById('data').innerHTML= atom.NumberAtom+' '+atom.Element+' '+atom.NameAtom+' '+atom.X+' '+atom.Y+' '+atom.Z;
                    //document.getElementById('data').innerHTML= "contador: "+contadores;
                }

                //document.getElementById('data').innerHTML=(lastMouseX-rect.left)+' '+(rect.bottom-lastMouseY);

                //alert(GetNumAtom(pixels));
               
                 //document.getElementById('data').innerHTML= 'number:' + number + ' '+ atom.NumberAtom+' '+atom.Element+' '+atom.NameAtom+' '+atom.X+' '+atom.Y+' '+atom.Z + ' readPixels:' + pixels[0] + ' ' + pixels[1] + ' ' + pixels[2];
            //alert(pixels[0] + ' ' + pixels[1] + ' ' + pixels[2]);
            //ColorTotal[0]=ColorTotalDiffuse[0];
            //alert(11);
            }

            gl.uniform1i(u_Clicked, 0);
            drawScene(0);

        }
    }

    function handleMouseUp(event) {
        mouseDown = false;
    }

    function handleMouseMove(event) {
        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX
        var newRotationMatrix = mat4.create();
        mat4.identity(newRotationMatrix);
        mat4.rotate(newRotationMatrix, degToRad(deltaX / 5), [0, 1, 0]);

        var deltaY = newY - lastMouseY;
        mat4.rotate(newRotationMatrix, degToRad(deltaY / 5), [1, 0, 0]);

        mat4.multiply(newRotationMatrix, RotationMatrix, RotationMatrix);

        lastMouseX = newX
        lastMouseY = newY;
    }


function CambiarRepresentacion(Repre)   //Representacion es en lo que se va a cambiar
{
    //alert(Repre);
    if (Repre=='Cpk') 
    {
        for(var o in AtomosSeleccionados) //son los objetos seleccionados 
        {
            //primero encontrar con el átomo "o" la posición en el bloque y en el array, y hacerle un splice ahí
            //
            var ato = AtomosSeleccionados[o];


            var bloques=Math.floor((ato.NumberAtom-1)/NoPaso);
            var diferencia=ato.NumberAtom-(bloques*NoPaso);

            
            var vertexPosition = (diferencia-1)*nVertices; //867 es el número de vértices por cada esfera de latitudes y longitudes 16
            var colorPosition  = (diferencia-1)*nColor;
            var indexPosition = (diferencia-1)*nIndices;

            //alert("AtomNum: "+ato.NumberAtom);
            if (ato.NameAtom=='H') 
            {
                //alert("H");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayH[z]   + ato.X -Cx); //estoy quitando y al mismo tiempo agregando, por lo que se queda
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayH[z+1] + ato.Y -Cy); //la misma longitud en cada operación
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayH[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayH[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayH[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayH[z+2] + ato.Z -Cz);                  

                    z=z+3;
                }

            }
            else if (ato.NameAtom=='C') 
            {
                //alert("C");
                //ingresar los nuevos vértices
                for (var z=0; z<867;)  
                {      
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);
                                            
                    z=z+3;
                }
               
                //alert("saleC"); 
            }
            else if (ato.NameAtom=='PB') 
            {
                //alert("PB");
                //ingresar los nuevos vértices
                for (var z=0; z<867;)  
                {        
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);
                   
                    z=z+3;
                }
                
            }
            else if (ato.NameAtom=='TI') 
            {
                //alert("TI");
                //ingresar los nuevos vértices
                for (var z=0; z<867;)  
                {        
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);
                  
                    z=z+3;
                }
               
            }
            else if (ato.NameAtom=='CA') 
            {
                //alert("CA");
                //ingresar los nuevos vértices
                for (var z=0; z<867;)  
                {      
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    z=z+3;
                }
               
            }
            else if (ato.NameAtom=='N') 
            {
                //alert("N");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayN[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayN[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayN[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayN[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayN[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayN[z+2] + ato.Z -Cz);
                                            
                    z=z+3;
                }
               
            }
            else if (ato.NameAtom=='O') 
            {
                //alert("O");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayO[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayO[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayO[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayO[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayO[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayO[z+2] + ato.Z -Cz);

                    z=z+3;
                }
               
                //alert("ssss");  

            }
             else if (ato.NameAtom=='S') 
            {
                //alert("S");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayS[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayS[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayS[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayS[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayS[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayS[z+2] + ato.Z -Cz);
                                            
                    z=z+3;
                }
               
            }
            else if (ato.NameAtom=='P') 
            {
                //alert("P");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayP[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayP[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayP[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayP[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayP[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayP[z+2] + ato.Z -Cz);

                    z=z+3;
                }
               
            }
            else /////////// DEFAULT
            {
                //alert("entra aqui");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    vertexPositionData[bloques].splice(vertexPosition + z,    1,verArrayDefault[z]   + ato.X -Cx);
                    vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArrayDefault[z+1] + ato.Y -Cy);
                    vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArrayDefault[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArrayDefault[z]   + ato.X -Cx);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArrayDefault[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArrayDefault[z+2] + ato.Z -Cz);

                    z=z+3;
                }
               
                //alert("eyyyyyyyyyytra aqui");
            }
            ato.Representation="CPK";

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[bloques]);
            gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(vertexPositionData[bloques]));   

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloques]);
            gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(vertexPositionDataD[bloques]));   
          
        }
    }
    else if (Repre=='SB') 
    {
        //alert(88);
        for(var o in AtomosSeleccionados) //son los objetos seleccionados 
        {
            //primero encontrar con el átomo "o" la posición en el bloque y en el array, y hacerle un splice ahí
            //
            var ato = AtomosSeleccionados[o];


            var bloques=Math.floor((ato.NumberAtom-1)/NoPaso);
            var diferencia=ato.NumberAtom-(bloques*NoPaso);

            
            var vertexPosition = (diferencia-1)*nVertices; //867 es el número de vértices por cada esfera de latitudes y longitudes 16
            var colorPosition  = (diferencia-1)*nColor;
            var indexPosition = (diferencia-1)*nIndices;

                      
            //ingresar los nuevos vértices
            for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
            {        
                vertexPositionData[bloques].splice(vertexPosition + z,    1,verArray[z]   + ato.X -Cx); //estoy quitando y al mismo tiempo agregando, por lo que se queda
                vertexPositionData[bloques].splice(vertexPosition + z + 1,1,verArray[z+1] + ato.Y -Cy); //la misma longitud en cada operación
                vertexPositionData[bloques].splice(vertexPosition + z + 2,1,verArray[z+2] + ato.Z -Cz);

                /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                vertexPositionDataD[bloques].splice(vertexPosition + z,    1,verArray[z]   + ato.X -Cx);
                vertexPositionDataD[bloques].splice(vertexPosition + z + 1,1,verArray[z+1] + ato.Y -Cy);
                vertexPositionDataD[bloques].splice(vertexPosition + z + 2,1,verArray[z+2] + ato.Z -Cz);                  

                z=z+3;
            }
            ato.Representation="SB";

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[bloques]);
            gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(vertexPositionData[bloques]));   

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloques]);
            gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(vertexPositionDataD[bloques]));   

        }

    }
    else
    {

    }
}

function Ejecutar()
{
    return function(event){
               CambiarRepresentacion("Cpk");
            }

}

function EjecutarS()
{
    return function(event){
               CambiarRepresentacion("SB");
            }

}