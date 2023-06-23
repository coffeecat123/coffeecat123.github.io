import pyautogui as p
import math
import time

o=[960,588]
r=300
time.sleep(3)
p.moveTo(o[0]+r,o[1])
p.mouseDown()
p.PAUSE=0.00000000000000000000000000000000001
i=0
while(i<=360):
    p.moveTo(o[0]+r*math.cos(i*math.pi/180)
            ,o[1]+r*math.sin(i*math.pi/180))
    i+=1
p.mouseUp()
