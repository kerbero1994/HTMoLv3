function initCamera()
{
    Cx=molecule.CenterX;
    Cy=molecule.CenterY;
    Cz=molecule.CenterZ;

    z=-Cz;
    
    if (Cx>Cy) 
    {
        CameraPosition=Cx;
    }
    else
    {
        CameraPosition=Cy;
    }
    if (CameraPosition>Cz) 
    {
        CameraPosition=Cz;
    }
    
    ZoomMotion=Math.ceil(CameraPosition/10);
    CameraPosition=CameraPosition*4;

}