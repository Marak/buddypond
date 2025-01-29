
import Filter from '../../../nodes/Filter.js';
import sliderComponent from '../../../../ui/Slider.js';

export default function createFilterComponent(track) {
    const { id: trackId, transport } = track;
    const { eq3Container } = transport;

    let filterContainer = document.createElement('div');
    filterContainer.classList.add('filter-container');

    // Filter/EQ Switch Button
    const filterEqSwitch = document.createElement('button');
    filterEqSwitch.textContent = 'FILTER';
    filterEqSwitch.classList.add('filterEqSwitch', 'btn-active');

    const filterSlider = sliderComponent(track, trackId, {
        trackWidth: '110px',
        trackHeight: '150px',
        thumbHeight: '24px',
        thumbWidth: '96px',
        className: 'filter-slider',
        thumbColor: 'yellow',
        showCenterLine: true,
        showScale: true,
        minValue: -1,
        maxValue: 1,
        value: -0.911,
        defaultValue: -1,
        sliderThumbStyles: { left: '6px' },
        onChange: (val) => Filter(track, val),
    });

    transport.filterSlider = filterSlider;
    filterContainer.append(filterSlider.sliderContainer);

    filterEqSwitch.addEventListener('click', () => {
        // fxSwitch.style.display = 'none';

        if (filterSlider.sliderContainer.style.display === 'block') {
            filterSlider.sliderContainer.style.display = 'none';
            filterEqSwitch.textContent = 'FILTER';

            eq3Container.querySelectorAll('div.label').forEach(label => {
                label.style.display = 'block';
            });
        } else {
            filterSlider.sliderContainer.style.display = 'block';
            filterEqSwitch.textContent = 'EQ3';

            eq3Container.querySelectorAll('div.label').forEach(label => {
                label.style.display = 'none';
            });
        }
    });

    filterContainer.append(filterEqSwitch);
    return filterContainer;
}