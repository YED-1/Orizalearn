from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from api.core.database import Base

class Evaluacion(Base):
    __tablename__ = "evaluaciones"

    id = Column(Integer, primary_key=True, index=True)
    # Llaves foráneas para saber QUIÉN hizo QUÉ examen
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    modulo_id = Column(Integer, ForeignKey("modulos.id"), nullable=False)
    # El resultado final que se verá en el dashboard
    calificacion = Column(Float, nullable=False)

    # func.now() guarda automáticamente la fecha y hora exacta del intento
    fecha_intento = Column(DateTime(timezone=True), server_default=func.now())